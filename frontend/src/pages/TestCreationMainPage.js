import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import TestCreationMainCount from '../components/testCreationMain/TestCreationMainCount/TestCreationMainCount';
import TestCreationMainCreator from '../components/testCreationMain/TestCreationMainCreator/TestCreationMainCreator';
import TestCreationMainPreview from '../components/testCreationMain/TestCreationMainPreview/TestCreationMainPreview';
import { getAccessToken } from '../utils/auth';

const TestCreationMainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passed = location.state?.testMeta || null;

  const [mode, setMode] = useState('create'); 
  const [questionsCount, setQuestionsCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

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
    isFixedTime: (passed?.durationMinutes ?? 0) > 0
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
        isFixedTime: (passed.durationMinutes ?? 0) > 0
      }));
    }
  }, [passed]);

  const handleNextQuestion = () => {
    const q = creatorRef.current?.getCurrentQuestionAndReset();
    
    if (!q) return;

    setQuestions(prev => {
      const updated = [...prev, q];
      setQuestionsCount(updated.length);
      return updated;
    });
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      setQuestionsCount(updated.length);
      return updated;
    });
  };

  const handlePublish = async () => {
    if (!questions.length) {
      alert("Немає питань для збереження!");
      return;
    }

    try {
      setLoading(true);
      const token = getAccessToken();

      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const testPayload = {
        testName: testMeta.testName,
        sphere: testMeta.sphere,
        level: testMeta.level,
        city: testMeta.city,
        vacancyDescription: testMeta.vacancyDescription,
        responsibilities: testMeta.responsibilities,
        startTime: testMeta.startTime ? testMeta.startTime.toISOString() : null,
        endTime: testMeta.endTime ? testMeta.endTime.toISOString() : null,
        durationMinutes: testMeta.durationMinutes > 0 ? testMeta.durationMinutes : 0,
        isFixedTime: testMeta.durationMinutes > 0
      };

      const testResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/tests`,
        testPayload,
        { headers }
      );

      const createdTest = testResponse.data;
      const testId = createdTest?.testId;

      if (!testId) {
        throw new Error('Сервер не повернув testId при створенні тесту');
      }

      for (const questionPayload of questions) {
        await axios.post(
          `${process.env.REACT_APP_BACKEND}/api/tests/${testId}/questions`,
          questionPayload,
          { headers }
        );
      }

      console.log('Тест і питання успішно збережені, testId =', testId);
      alert('✅ Тест успішно створено!');

      setQuestions([]);
      setQuestionsCount(0);
      setMode("create");
      navigate('/viewingtests');

    } catch (error) {
      console.error("Помилка при збереженні тесту:", error);
      const msg = error.response?.data?.message || error.response?.data || error.message;
      alert(`❌ Помилка: ${msg}`);
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
        <TestCreationMainCreator
          ref={creatorRef}
          onQuestionsChange={setQuestionsCount}
        />
      ) : (
        <TestCreationMainPreview
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
        />
      )}

      <div className='testCreationMainButtons'>
        <div className='container testCreationMainButtons__container'>
          {mode === 'create' ? (
            <>
              <button
                className='testCreationMainButtons__next white-btn'
                onClick={handleNextQuestion}
              >
                Додати запитання
              </button>
              <button
                className='testCreationMainButtons__finish black-btn'
                onClick={() => setMode('preview')}
              >
                Переглянути результат
              </button>
            </>
          ) : (
            <>
              <button
                className='testCreationMainButtons__back white-btn'
                onClick={() => setMode('create')}
                disabled={loading}
              >
                Повернутися до створення
              </button>
              <button
                className='testCreationMainButtons__publish black-btn'
                onClick={handlePublish}
                disabled={loading}
              >
                {loading ? "Збереження..." : "Завершити створення"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCreationMainPage;