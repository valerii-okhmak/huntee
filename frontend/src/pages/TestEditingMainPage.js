import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import TestCreationMainCount from '../components/testCreationMain/TestCreationMainCount/TestCreationMainCount';
import TestCreationMainCreator from '../components/testCreationMain/TestCreationMainCreator/TestCreationMainCreator';
import TestCreationMainPreview from '../components/testCreationMain/TestCreationMainPreview/TestCreationMainPreview';
import ConfirmationTestCreateModal from '../components/modal_windows/ConfirmTestCreateModal'; 
import { getAccessToken } from '../utils/auth';

const TestEditingMainPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState('preview');
  const [questionsCount, setQuestionsCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  const creatorRef = useRef(null);

  const [testMeta, setTestMeta] = useState({
    testName: '',
    sphere: '',
    level: '',
    city: '',
    vacancyDescription: '',
    responsibilities: '',
    startTime: null,
    endTime: null,
    durationMinutes: 0,
    isFixedTime: false,
    isPrivate: false,
    isShowResult: true,
    isFixedQuestionOrder: false,
    isFixedAnswerOrder: false
  });

  // === 1. ЗАВАНТАЖЕННЯ ДАНИХ ТА НОРМАЛІЗАЦІЯ ===
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);
        const token = getAccessToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const testRes = await axios.get(
          `${process.env.REACT_APP_BACKEND}/api/tests/${testId}`, 
          { headers }
        );
        
        const data = testRes.data;
        console.log("Original Data from Backend:", data);

        // Заповнюємо мета-дані тесту
        setTestMeta({
          testName: data.testName || '',
          sphere: data.sphere || '',
          level: data.level || '',
          city: data.city || '',
          vacancyDescription: data.vacancyDescription || '',
          responsibilities: data.responsibilities || '',
          // Безпечне перетворення рядків дати в об'єкти Date
          startTime: data.startTime ? new Date(data.startTime) : null,
          endTime: data.endTime ? new Date(data.endTime) : null,
          durationMinutes: data.durationMinutes || 0,
          isFixedTime: (data.durationMinutes > 0) || data.isFixedTime || false,
          isPrivate: data.isPrivate || false,
          isShowResult: data.isShowResult !== undefined ? data.isShowResult : true,
          isFixedQuestionOrder: data.isFixedQuestionOrder || false,
          isFixedAnswerOrder: data.isFixedAnswerOrder || false
        });

        // === КРИТИЧНЕ ВИПРАВЛЕННЯ ДЛЯ ПИТАНЬ ===
        if (data.questions && Array.isArray(data.questions)) {
             const normalizedQuestions = data.questions.map(q => ({
                 ...q,
                 // 1. Фронтенд (React key) часто чекає 'id', а бек дає 'questionId'. Дублюємо.
                 id: q.questionId || q.id, 
                 questionId: q.questionId || q.id,
                 
                 // 2. Нормалізація опцій (відповідей)
                 options: (q.options || []).map(opt => ({
                     ...opt,
                     id: opt.optionId || opt.id,       // Уніфікація ID опції
                     text: opt.optionText || opt.text, // Уніфікація тексту опції
                     isCorrect: opt.isCorrect
                 }))
             }));
             
             console.log("Normalized Questions:", normalizedQuestions);
             setQuestions(normalizedQuestions);
             setQuestionsCount(normalizedQuestions.length);
        } else {
             setQuestions([]);
             setQuestionsCount(0);
        }

      } catch (error) {
        console.error("Error fetching test data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchTestData();
    }
  }, [testId]);

  // Додавання питання з Creator в загальний список
  const addCurrentQuestionIfExists = () => {
    const q = creatorRef.current?.getCurrentQuestionAndReset();
    if (!q) return false;
    
    // Нове питання поки що не має questionId (воно з'явиться після збереження)
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

  const handleTrySave = () => {
    // Якщо хочете заборонити зберігати пустий тест:
    if (questions.length === 0) {
      setShowError(true);
      return;
    }
    setIsModalOpen(true);
  };

  // === 2. ЛОГІКА ЗБЕРЕЖЕННЯ (UPDATE) ===
  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const token = getAccessToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const finalQuestionIds = [];

      // Проходимо по всіх питаннях у поточному стані
      for (const q of questions) {
        if (q.questionId) {
            // А) Якщо ID є - це старе питання. Просто додаємо його ID в список.
            // (Якщо ви не редагували текст старих питань, цього достатньо)
            finalQuestionIds.push(q.questionId);
        } else {
            // Б) Якщо ID немає - це НОВЕ питання. Треба створити його на бекенді.
            
            // Підготовка DTO для створення питання
            const questionPayload = {
                questionText: q.questionText || q.title, 
                questionType: q.questionType || 'SINGLE_CHOICE',
                weight: q.weight || 1,
                options: (q.options || []).map(opt => ({
                    optionText: opt.optionText || opt.text, 
                    isCorrect: opt.isCorrect
                }))
            };

            console.log("Creating NEW question:", questionPayload);

            // POST запит на створення питання
            const createRes = await axios.post(
                `${process.env.REACT_APP_BACKEND}/api/questions`, 
                questionPayload, 
                { headers }
            );
            
            // Отримуємо ID створеного питання
            const newId = createRes.data.questionId || createRes.data.id;
            if (newId) {
                finalQuestionIds.push(newId);
            }
        }
      }

      // Формуємо фінальний об'єкт для оновлення тесту
      const testPayload = {
        testName: testMeta.testName,
        sphere: testMeta.sphere,
        level: testMeta.level,
        city: testMeta.city,
        vacancyDescription: testMeta.vacancyDescription,
        responsibilities: testMeta.responsibilities,
        isFixedTime: testMeta.isFixedTime,
        // Перетворення дат в ISO рядок (з перевіркою на null)
        startTime: testMeta.startTime ? testMeta.startTime.toISOString() : null,
        endTime: testMeta.endTime ? testMeta.endTime.toISOString() : null,
        durationMinutes: parseInt(testMeta.durationMinutes) || 0,
        isPrivate: testMeta.isPrivate,
        isFixedQuestionOrder: testMeta.isFixedQuestionOrder,
        isFixedAnswerOrder: testMeta.isFixedAnswerOrder,
        isShowResult: testMeta.isShowResult,
        questionIds: finalQuestionIds // Список усіх ID (старих + нових)
      };

      console.log("Updating Test with payload:", testPayload);

      await axios.put(
        `${process.env.REACT_APP_BACKEND}/api/tests/${testId}`,
        testPayload,
        { headers }
      );

      // Успіх -> перехід на сторінку "Мої тести"
      navigate('/mytests'); 

    } catch (error) {
      console.error("Error saving test:", error);
      const msg = error.response?.data?.message || error.message || "Невідома помилка";
      alert("Помилка збереження: " + msg);
    } finally {
      setSaving(false);
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return <div className="page"><div className="container">Завантаження даних тесту...</div></div>;
  }

  return (
    <div className='page'>
      <GeneralTestInfoHeader
        field={testMeta.sphere}
        title={testMeta.testName} 
        location={testMeta.city}
        // Безпечне відображення дат
        date={testMeta.startTime ? testMeta.startTime.toLocaleDateString('uk-UA') : ''}
        time={testMeta.startTime ? testMeta.startTime.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) : ''}
      />

      <TestCreationMainCount questionsCount={questionsCount} />

      {mode === 'create' ? (
        <TestCreationMainCreator ref={creatorRef} />
      ) : (
        <TestCreationMainPreview
          questions={questions} // Тепер тут точно є поля 'id' і 'text'
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
              <button className='testCreationMainButtons__back white-btn' onClick={() => setMode('create')}>
                Додати нове питання
              </button>
              <button
                className='testCreationMainButtons__publish black-btn'
                onClick={handleTrySave} 
                disabled={saving}
              >
                {saving ? 'Збереження...' : 'Зберегти зміни'}
              </button>
            </>
          )}
        </div>
      </div>
      
      <ConfirmationTestCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSaveChanges}
        loading={saving}
        title="Зберегти зміни?"
        message="Всі зміни будуть застосовані. Старий список питань буде оновлено."
        buttonText="Зберегти"
        questionsCount={questions.length}
        startDate={testMeta.startTime ? testMeta.startTime.toLocaleDateString('uk-UA') : '-'}
        startTime={testMeta.startTime ? testMeta.startTime.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) : '-'}
      />
    </div>
  );
};

export default TestEditingMainPage;