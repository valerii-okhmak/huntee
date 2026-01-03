import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import TestCreationMainCount from '../components/testCreationMain/TestCreationMainCount/TestCreationMainCount';
import TestCreationMainCreator from '../components/testCreationMain/TestCreationMainCreator/TestCreationMainCreator';
import TestCreationMainPreview from '../components/testCreationMain/TestCreationMainPreview/TestCreationMainPreview';
import ConfirmationTestCreateModal from '../components/modal_windows/ConfirmTestCreateModal';
import { getAccessToken } from '../utils/auth';

const TestCreationMainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passed = location.state?.testMeta || null;

  const [mode, setMode] = useState('create');
  const [questionsCount, setQuestionsCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false); // Стан для підсвітки помилки

  const creatorRef = useRef(null);

  const [testMeta, setTestMeta] = useState(() => ({
    testName: passed?.testName || 'Новий тест',
    sphere: passed?.field || 'unknown',
    level: (passed?.level || 'JUNIOR')?.toUpperCase(),
    city: passed?.city || 'online',
    vacancyDescription: passed?.vacancyDescription || '',
    responsibilities: passed?.responsibilities || '',
    startTime: passed?.startTime ? new Date(passed.startTime) : null,
    endTime: passed?.endTime ? new Date(passed.endTime) : null,
    durationMinutes: passed?.durationMinutes || 0,
    isFixedTime: (passed?.durationMinutes ?? 0) > 0,
    isPrivate: passed?.isPrivate || false,
    isShowResult: passed?.isShowResult || true,
    isFixedQuestionOrder: passed?.isFixedQuestionOrder || false,
    isFixedAnswerOrder: passed?.isFixedAnswerOrder || false
  }));

  useEffect(() => {
    if (passed) {
      setTestMeta(prev => ({
        ...prev,
        testName: passed.testName || prev.testName,
        sphere: passed.field || prev.sphere,
        level: passed.level || prev.level,
        city: passed.city || prev.city,
        vacancyDescription: passed.vacancyDescription || prev.vacancyDescription,
        responsibilities: passed.responsibilities || prev.responsibilities,
        startTime: passed.startTime ? new Date(passed.startTime) : prev.startTime,
        endTime: passed.endTime ? new Date(passed.endTime) : prev.endTime,
        durationMinutes: passed.durationMinutes || 0,
        isFixedTime: (passed.durationMinutes ?? 0) > 0,
        isPrivate: passed.isPrivate ?? prev.isPrivate,
        isShowResult: passed.isShowResult ?? prev.isShowResult,
        isFixedQuestionOrder: passed.isFixedQuestionOrder ?? prev.isFixedQuestionOrder,
        isFixedAnswerOrder: passed.isFixedAnswerOrder ?? prev.isFixedAnswerOrder
      }));
    }
  }, [passed]);

  const addCurrentQuestionIfExists = () => {
    const q = creatorRef.current?.getCurrentQuestionAndReset();
    if (!q) return false;
    setQuestions(prev => {
      const updated = [...prev, q];
      setQuestionsCount(updated.length);
      return updated;
    });
    return true;
  };

  const handleNextQuestion = () => {
    addCurrentQuestionIfExists();
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      setQuestionsCount(updated.length);
      return updated;
    });
  };

  // Перевірка перед відкриттям модалки публікації
  const handleTryPublish = () => {
    if (questions.length === 0) {
      setShowError(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handlePublish = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // 1. Публікуємо мета-дані тесту
      const testPayload = {
        ...testMeta,
        startTime: testMeta.startTime ? testMeta.startTime.toISOString() : null,
        endTime: testMeta.endTime ? testMeta.endTime.toISOString() : null,
      };

      const testResponse = await axios.post(
        `/api/tests`,
        testPayload,
        { headers }
      );

      const testId = testResponse.data?.testId;

      // 2. Публікуємо питання з додаванням orderIndex
      // Використовуємо звичайний цикл з індексом або entries()
      for (let i = 0; i < questions.length; i++) {
        const questionPayload = {
          ...questions[i],
          orderIndex: i, // Передаємо порядковий номер (0, 1, 2...)
          weight: questions[i].points
        };

        await axios.post(
          `/api/tests/${testId}/questions`,
          questionPayload,
          { headers }
        );
      }

      navigate('/viewingtests');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='page'>
      <GeneralTestInfoHeader
        field={testMeta.sphere}
        title={testMeta.testName}
        location={testMeta.city}
        date={testMeta.startTime ? testMeta.startTime.toLocaleDateString() : ''}
        time={testMeta.startTime ? testMeta.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
      />

      <TestCreationMainCount questionsCount={questionsCount} />

      {mode === 'create' ? (
        <TestCreationMainCreator ref={creatorRef} />
      ) : (
        <TestCreationMainPreview
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          showError={showError} 
        />
      )}

      <div className='testCreationMainButtons'>
        <div className='container testCreationMainButtons__container'>
          {mode === 'create' ? (
            <>
              <button className='testCreationMainButtons__next white-btn' onClick={handleNextQuestion}>
                Додати запитання
              </button>
              <button
                className='testCreationMainButtons__finish black-btn'
                onClick={() => {
                  addCurrentQuestionIfExists();
                  setMode('preview');
                }}
              >
                Переглянути результат
              </button>
            </>
          ) : (
            <>
              <button className='testCreationMainButtons__back white-btn' onClick={() => setMode('create')} disabled={loading}>
                Повернутися до створення
              </button>
              <button
                className='testCreationMainButtons__publish black-btn'
                onClick={handleTryPublish} 
                disabled={loading}
              >
                Завершити створення
              </button>
            </>
          )}
        </div>
      </div>
      
      <ConfirmationTestCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          handlePublish();
        }}
        loading={loading}
        questionsCount={questions.length}
        startDate={testMeta.startTime ? testMeta.startTime.toLocaleDateString('uk-UA') : 'не вказано'}
        startTime={testMeta.startTime ? testMeta.startTime.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) : 'не вказано'}
      />
    </div>
  );
};

export default TestCreationMainPage;