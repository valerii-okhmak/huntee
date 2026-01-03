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
  const isEditMode = Boolean(passed?.testId);

  const [mode, setMode] = useState('create');
  const [questionsCount, setQuestionsCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  const creatorRef = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      setMode('preview');
    }
  }, [isEditMode]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!isEditMode) return;
  
      try {
        const token = getAccessToken();
        const { data } = await axios.get(
          `/api/tests/${passed.testId}/questions`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          }
        );
  
        setQuestions(data);
        setOriginalQuestions(data);
        setQuestionsCount(data.length);
      } catch (e) {
        console.error(e);
      }
    };
  
    fetchQuestions();
  }, [isEditMode, passed?.testId]);  


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
  
      const testPayload = {
        ...testMeta,
        startTime: testMeta.startTime ? testMeta.startTime.toISOString() : null,
        endTime: testMeta.endTime ? testMeta.endTime.toISOString() : null,
      };
  
      let testId = passed?.testId;
  
      if (isEditMode) {
        await axios.put(`/api/tests/${testId}`, testPayload, { headers });

        const originalIds = originalQuestions.map(q => q.id);
        const currentIds = questions.filter(q => q.id).map(q => q.id);
        const toDelete = originalIds.filter(id => !currentIds.includes(id));

        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
        
          if (q.id) {
            await axios.put(`/api/questions/${q.id}`, {
              ...q,
              orderIndex: i
            }, { headers });
          } else {
            await axios.post(`/api/tests/${testId}/questions`, {
              ...q,
              orderIndex: i
            }, { headers });
          }
        }

        for (const id of toDelete) {
          await axios.delete(`/api/questions/${id}`, { headers });
        }
  
      } else {
        const res = await axios.post(`/api/tests`, testPayload, { headers });
        testId = res.data?.testId;

        for (let i = 0; i < questions.length; i++) {
          await axios.post(
            `/api/tests/${testId}/questions`,
            {
              ...questions[i],
              orderIndex: i,
              weight: questions[i].points
            },
            { headers }
          );
        }
      }      
  
      navigate('/viewingtests');
    } catch (e) {
      console.error(e);
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