import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // Додано useParams
import axios from 'axios';

import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import TestCreationMainCount from '../components/testCreationMain/TestCreationMainCount/TestCreationMainCount';
import TestCreationMainCreator from '../components/testCreationMain/TestCreationMainCreator/TestCreationMainCreator';
import TestCreationMainPreview from '../components/testCreationMain/TestCreationMainPreview/TestCreationMainPreview';
import ConfirmationTestCreateModal from '../components/modal_windows/ConfirmTestCreateModal';

import { getAccessToken } from '../utils/auth';

const TestCreationMainPage = () => {
  const { testId } = useParams(); // Отримуємо ID з URL (якщо це редагування)
  const location = useLocation();
  const navigate = useNavigate();
  
  // Дані, передані при переході (для створення нового)
  const passedState = location.state?.testMeta || null;

  // --- State ---
  const [mode, setMode] = useState('create');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(!!testId); // Стан завантаження даних при редагуванні
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  const creatorRef = useRef(null);

  const [testMeta, setTestMeta] = useState({
    testName: 'Новий тест',
    sphere: 'unknown',
    level: 'JUNIOR',
    city: 'online',
    vacancyDescription: '',
    responsibilities: '',
    startTime: null,
    endTime: null,
    durationMinutes: 60,
    isFixedTime: false,
    isPrivate: false,
    isShowResult: true,
    isFixedQuestionOrder: false,
    isFixedAnswerOrder: false
  });

  // 1. ЗАВАНТАЖЕННЯ ДАНИХ (для режиму редагування)
  useEffect(() => {
    const fetchTestData = async () => {
      if (!testId) {
        // Якщо це створення нового - беремо дані з попередньої сторінки (passedState)
        if (passedState) {
          setTestMeta(prev => ({
            ...prev,
            ...passedState,
            startTime: passedState.startTime ? new Date(passedState.startTime) : null,
            endTime: passedState.endTime ? new Date(passedState.endTime) : null,
            isFixedTime: (passedState.durationMinutes ?? 0) > 0,
          }));
        }
        return;
      }

      // Якщо є testId - завантажуємо з бекенду
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/api/tests/${testId}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const data = response.data;

        // Встановлюємо метадані
        setTestMeta({
          testName: data.testName,
          sphere: data.sphere,
          level: data.level,
          city: data.city,
          vacancyDescription: data.vacancyDescription,
          responsibilities: data.responsibilities,
          startTime: data.startTime ? new Date(data.startTime) : null,
          endTime: data.endTime ? new Date(data.endTime) : null,
          durationMinutes: data.durationMinutes,
          isFixedTime: data.isFixedTime,
          isPrivate: data.isPrivate,
          isShowResult: data.isShowResult,
          isFixedQuestionOrder: data.isFixedQuestionOrder,
          isFixedAnswerOrder: data.isFixedAnswerOrder
        });

        // Встановлюємо питання (якщо вони приходять вкладеним об'єктом або окремим запитом)
        // Припускаємо, що response.data.questions - це масив питань
        if (data.questions && Array.isArray(data.questions)) {
            const mappedQuestions = data.questions.map(q => ({
                id: q.id, // Важливо зберегти ID для редагування
                questionText: q.questionText,
                questionType: q.questionType,
                points: q.weight,
                comment: q.comment,
                answers: q.answers // Переконайтеся, що структура відповідей збігається
            }));
            setQuestions(mappedQuestions);
        }

      } catch (error) {
        console.error("Failed to load test:", error);
        alert("Помилка завантаження тесту");
        navigate('/viewingtests');
      } finally {
        setDataLoading(false);
      }
    };

    fetchTestData();
  }, [testId, passedState, navigate]);


  // --- Handlers ---

  const addCurrentQuestionIfExists = () => {
    if (creatorRef.current) {
      const newQuestion = creatorRef.current.getCurrentQuestionAndReset();
      if (newQuestion) {
        // Додаємо нове питання без ID (backend згенерує при збереженні)
        setQuestions(prev => [...prev, newQuestion]);
        setShowError(false);
        return true;
      }
    }
    return false;
  };

  const handleNextQuestion = () => {
    addCurrentQuestionIfExists();
  };

  const handleSwitchToPreview = () => {
    addCurrentQuestionIfExists();
    setMode('preview');
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleTryPublish = () => {
    if (questions.length === 0) {
      setShowError(true);
      return;
    }
    setIsModalOpen(true);
  };

  // --- ГОЛОВНА ЛОГІКА ЗБЕРЕЖЕННЯ / РЕДАГУВАННЯ ---
  const handlePublish = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let currentTestId = testId;

      // 1. Якщо це СТВОРЕННЯ (немає testId в URL), спочатку створюємо "болванку" тесту
      if (!currentTestId) {
        const createPayload = {
            testName: testMeta.testName,
            sphere: testMeta.sphere,
            level: testMeta.level,
            // ...мінімально необхідні поля
        };
        const createRes = await axios.post(`${process.env.REACT_APP_BACKEND}/api/tests`, createPayload, { headers });
        currentTestId = createRes.data.id; // Отримуємо ID нового тесту
      }

      // 2. Обробка питань (Створення нових або Оновлення старих)
      const finalQuestionIds = [];

      for (const q of questions) {
        const questionPayload = {
            questionText: q.questionText,
            questionType: q.questionType,
            weight: q.points || 1,
            comment: q.comment || "",
            answers: q.answers
        };

        if (q.id) {
            // А) Питання вже існує (має ID) -> ОНОВЛЮЄМО (PUT)
            await axios.put(
                `${process.env.REACT_APP_BACKEND}/api/questions/${q.id}`, 
                questionPayload, 
                { headers }
            );
            finalQuestionIds.push(q.id);
        } else {
            // Б) Питання нове (немає ID) -> СТВОРЮЄМО (POST)
            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND}/api/questions`, 
                questionPayload, 
                { headers }
            );
            finalQuestionIds.push(res.data.id);
        }
      }

      // 3. Фінальне оновлення тесту (PUT)
      // Це оновлює метадані (якщо змінилися) і прив'язує правильний порядок питань
      const updateRequest = {
        testName: testMeta.testName,
        sphere: testMeta.sphere,
        level: testMeta.level,
        city: testMeta.city,
        vacancyDescription: testMeta.vacancyDescription,
        responsibilities: testMeta.responsibilities,
        isFixedTime: testMeta.isFixedTime,
        startTime: testMeta.startTime ? testMeta.startTime.toISOString() : null,
        endTime: testMeta.endTime ? testMeta.endTime.toISOString() : null,
        durationMinutes: Number(testMeta.durationMinutes),
        isPrivate: testMeta.isPrivate,
        isFixedQuestionOrder: testMeta.isFixedQuestionOrder,
        isFixedAnswerOrder: testMeta.isFixedAnswerOrder,
        isShowResult: testMeta.isShowResult,
        questionIds: finalQuestionIds // Список ID (старих та нових) у потрібному порядку
      };

      await axios.put(
        `${process.env.REACT_APP_BACKEND}/api/tests/${currentTestId}`,
        updateRequest,
        { headers }
      );

      navigate('/viewingtests');
    } catch (error) {
      console.error("Error saving test:", error);
      alert(`Помилка збереження: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
      return <div className="page p-10 text-center">Завантаження даних тесту...</div>;
  }

  return (
    <div className='page testCreationMainPage'>
      <GeneralTestInfoHeader
        field={testMeta.sphere}
        title={testMeta.testName}
        location={testMeta.city}
        date={testMeta.startTime ? testMeta.startTime.toLocaleDateString() : ''}
        time={testMeta.startTime ? testMeta.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
      />

      <TestCreationMainCount questionsCount={questions.length} />

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
              <button 
                className='testCreationMainButtons__next white-btn' 
                onClick={handleNextQuestion}
              >
                Додати запитання
              </button>
              <button
                className='testCreationMainButtons__finish black-btn'
                onClick={handleSwitchToPreview}
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
                {/* Якщо є питання - повернутися до додавання, інакше просто назад */}
                Додати ще питання
              </button>
              <button
                className='testCreationMainButtons__publish black-btn'
                onClick={handleTryPublish} 
                disabled={loading}
              >
                {loading ? 'Збереження...' : (testId ? 'Зберегти зміни' : 'Створити тест')}
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
        isEditMode={!!testId} // Можна передати в модалку, щоб змінити текст заголовка
        questionsCount={questions.length}
        startDate={testMeta.startTime ? testMeta.startTime.toLocaleDateString('uk-UA') : 'не вказано'}
        startTime={testMeta.startTime ? testMeta.startTime.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) : 'не вказано'}
      />
    </div>
  );
};

export default TestCreationMainPage;