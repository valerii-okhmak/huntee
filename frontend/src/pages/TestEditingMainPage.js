import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Імпорти компонентів
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import TestCreationMainCount from '../components/testCreationMain/TestCreationMainCount/TestCreationMainCount';
import TestCreationMainCreator from '../components/testCreationMain/TestCreationMainCreator/TestCreationMainCreator';
import ConfirmationTestCreateModal from '../components/modal_windows/ConfirmTestCreateModal'; 
import { getAccessToken } from '../utils/auth';

// Імпортуємо компонент Preview
import TestEditingMainPreview from '../components/testCreationMain/TestCreationMainPreview/TestEditingMainPreview';

const TestEditingMainPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  // === СТАНИ ===
  const [mode, setMode] = useState('preview'); // 'preview' або 'create'
  const [questionsCount, setQuestionsCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  
  // Список ID питань, які треба видалити з БД при збереженні
  const [deletedQuestionIds, setDeletedQuestionIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  const creatorRef = useRef(null);

  // Метадані тесту
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

  // === 1. ЗАВАНТАЖЕННЯ ДАНИХ (GET) ===
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

        // 1.1 Заповнюємо шапку тесту
        setTestMeta({
          testName: data.testName || '',
          sphere: data.sphere || '',
          level: data.level || '',
          city: data.city || '',
          vacancyDescription: data.vacancyDescription || '',
          responsibilities: data.responsibilities || '',
          startTime: data.startTime ? new Date(data.startTime) : null,
          endTime: data.endTime ? new Date(data.endTime) : null,
          durationMinutes: data.durationMinutes || 0,
          isFixedTime: (data.durationMinutes > 0) || data.isFixedTime || false,
          isPrivate: data.isPrivate || false,
          isShowResult: data.isShowResult !== undefined ? data.isShowResult : true,
          isFixedQuestionOrder: data.isFixedQuestionOrder || false,
          isFixedAnswerOrder: data.isFixedAnswerOrder || false
        });

        // 1.2 Нормалізація питань (Backend -> Frontend)
        if (data.questions && Array.isArray(data.questions)) {
             const normalizedQuestions = data.questions.map(q => {
                 // Визначаємо тип для Frontend (single/multiple/text)
                 let frontendType = 'single'; 
                 const rawType = q.type || q.questionType || '';

                 if (rawType === 'SINGLE_CHOICE') frontendType = 'single';
                 else if (rawType === 'MULTIPLE_CHOICE') frontendType = 'multiple';
                 else if (rawType === 'TEXT' || rawType === 'OPEN_ANSWER') frontendType = 'text';
                 else if (rawType.toLowerCase().includes('multi')) frontendType = 'multiple';

                 // Нормалізуємо опції
                 const fullOptions = (q.options || q.choiceOptions || []).map(opt => ({
                     id: opt.optionId || opt.id,
                     key: opt.optionId || opt.id, 
                     text: opt.optionText || opt.text || '', 
                     optionText: opt.optionText || opt.text || '',
                     label: opt.optionText || opt.text || '',
                     isCorrect: opt.isCorrect
                 }));

                 return {
                     ...q, 
                     id: q.questionId || q.id, 
                     questionId: q.questionId || q.id,
                     
                     // Тип для UI
                     type: frontendType, 
                     // Тип для Backend (зберігаємо оригінал)
                     questionType: rawType || 'SINGLE_CHOICE',

                     title: q.questionText || q.title || '',
                     questionText: q.questionText || '',

                     // Для текстових питань
                     correctText: q.correctText || q.textAnswer || '',

                     // Опції
                     options: fullOptions,
                     answers: fullOptions,
                     choiceOptions: fullOptions
                 };
             });
             
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

  // Додавання питання з Creator
  const addCurrentQuestionIfExists = () => {
    const q = creatorRef.current?.getCurrentQuestionAndReset();
    if (!q) return false;
    
    setQuestions(prev => {
      const updated = [...prev, q];
      setQuestionsCount(updated.length);
      return updated;
    });
    setShowError(false); 
    return true;
  };

  const handleNextQuestion = () => {
    addCurrentQuestionIfExists();
  };

  // Видалення питання (локально + маркування для БД)
  const handleDeleteQuestion = (index) => {
    setQuestions(prev => {
      const questionToRemove = prev[index];
      
      // Перевіряємо, чи це питання з бази (має довгий ID типу UUID)
      if (questionToRemove && questionToRemove.questionId && String(questionToRemove.questionId).length > 10) {
          console.log("Marking for deletion:", questionToRemove.questionId);
          setDeletedQuestionIds(prevDeleted => [...prevDeleted, questionToRemove.questionId]);
      }

      const updated = [...prev];
      updated.splice(index, 1);
      setQuestionsCount(updated.length);
      return updated;
    });
  };

  const handleTrySave = () => {
    if (questions.length === 0) {
      setShowError(true);
      return;
    }
    setIsModalOpen(true);
  };

  // === 2. ЗБЕРЕЖЕННЯ ЗМІН ===
  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const token = getAccessToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // -------------------------------------------------------------
      // КРОК 0: Видалення питань, які користувач видалив в UI
      // -------------------------------------------------------------
      if (deletedQuestionIds.length > 0) {
          console.log("Deleting questions from DB:", deletedQuestionIds);
          await Promise.all(deletedQuestionIds.map(id => 
              axios.delete(`${process.env.REACT_APP_BACKEND}/api/questions/${id}`, { headers })
          ));
          setDeletedQuestionIds([]);
      }

      const finalQuestionIds = [];

      // -------------------------------------------------------------
      // КРОК 1: Створення нових питань (Strict Logic Mode)
      // -------------------------------------------------------------
      for (const q of questions) {
        // Якщо питання вже існує (має довгий ID), просто запам'ятовуємо ID
        if (q.questionId && String(q.questionId).length > 10) { 
            finalQuestionIds.push(q.questionId);
        } else {
            // === СТВОРЕННЯ НОВОГО ПИТАННЯ ===
            
            // Отримуємо масив опцій
            const currentOptions = q.options || q.answers || q.choiceOptions || [];
            
            // Рахуємо кількість правильних відповідей
            // ВАЖЛИВО: приводимо до boolean, бо може бути рядок "true"
            const correctCount = currentOptions.filter(opt => opt.isCorrect === true || opt.isCorrect === 'true' || opt.isCorrect === 1).length;

            // 1. Визначаємо тип для Backend
            let backendType = 'SINGLE_CHOICE';
            const typeLower = (q.type || '').toLowerCase();

            // ЛОГІКА ТИПІЗІАЦІЇ:
            if (typeLower === 'text' || typeLower === 'open' || (q.questionType && q.questionType.includes('TEXT'))) {
                backendType = 'TEXT'; 
            }
            else if (correctCount > 1) {
                // Якщо правильних відповідей > 1, це ЗАВЖДИ Multiple
                backendType = 'MULTIPLE_CHOICE';
            }
            else {
                // Якщо правильна відповідь 1 (або 0), форсуємо SINGLE_CHOICE.
                // Це обходить помилку, коли Backend свариться на "Multiple choice з 1 відповіддю".
                backendType = 'SINGLE_CHOICE';
            }

            const questionPayload = {
                questionText: q.title || q.questionText || 'New Question', 
                questionType: backendType,
                weight: q.weight || 1
            };

            // 2. Формуємо правильні поля залежно від типу
            if (backendType === 'TEXT') {
                questionPayload.choiceOptions = null;
                questionPayload.correctText = q.correctText || q.answer || q.text || '';
            } else {
                // Для вибору (SINGLE або MULTIPLE)
                questionPayload.choiceOptions = currentOptions.map(opt => ({
                    optionText: opt.text || opt.optionText || opt.label || '', 
                    isCorrect: (opt.isCorrect === true || opt.isCorrect === 'true' || opt.isCorrect === 1)
                }));
                questionPayload.correctText = null;
            }

            console.log(`Creating Question: [${backendType}] Correct: ${correctCount} | Payload:`, questionPayload);

            const createRes = await axios.post(
                `${process.env.REACT_APP_BACKEND}/api/tests/${testId}/questions`, 
                questionPayload, 
                { headers }
            );
            
            const newId = createRes.data.questionId || createRes.data.id;
            if (newId) {
                finalQuestionIds.push(newId);
            }
        }
      }

      // -------------------------------------------------------------
      // КРОК 2: Оновлення метаданих тесту
      // -------------------------------------------------------------
      
      const formatDate = (date) => {
          if (!date) return null;
          try {
              // YYYY-MM-DDTHH:mm:ssZ
              return new Date(date).toISOString().split('.')[0] + 'Z';
          } catch (e) {
              return null;
          }
      };

      const toUpper = (str) => (str ? String(str).toUpperCase().trim() : null);

      const testPayload = {
        testName: testMeta.testName ? testMeta.testName.trim() : "Untitled Test",
        sphere: toUpper(testMeta.sphere), 
        level: toUpper(testMeta.level),
        city: testMeta.city || "",
        vacancyDescription: testMeta.vacancyDescription || "",
        responsibilities: testMeta.responsibilities || "",
        isFixedTime: !!testMeta.isFixedTime,
        startTime: formatDate(testMeta.startTime),
        endTime: formatDate(testMeta.endTime),
        durationMinutes: Number(testMeta.durationMinutes) || 0,
        isPrivate: !!testMeta.isPrivate,
        isFixedQuestionOrder: !!testMeta.isFixedQuestionOrder,
        isFixedAnswerOrder: !!testMeta.isFixedAnswerOrder,
        isShowResult: !!testMeta.isShowResult,
      };

      console.log("PUT Payload sending to Backend:", JSON.stringify(testPayload, null, 2));

      await axios.put(
        `${process.env.REACT_APP_BACKEND}/api/tests/${testId}`,
        testPayload,
        { headers }
      );

      navigate('/mytests'); 

    } catch (error) {
      console.error("Error saving test:", error);
      const msg = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
      alert("Помилка збереження: " + msg);
    } finally {
      setSaving(false);
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return <div className="page"><div className="container" style={{marginTop: '100px', textAlign: 'center'}}>Завантаження даних тесту...</div></div>;
  }

  return (
    <div className='page'>
      <GeneralTestInfoHeader
        field={testMeta.sphere}
        title={testMeta.testName} 
        location={testMeta.city}
        date={testMeta.startTime ? testMeta.startTime.toLocaleDateString('uk-UA') : ''}
        time={testMeta.startTime ? testMeta.startTime.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) : ''}
      />

      <TestCreationMainCount questionsCount={questionsCount} />

      {mode === 'create' ? (
        <TestCreationMainCreator ref={creatorRef} />
      ) : (
        <TestEditingMainPreview
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
        message="Всі зміни будуть застосовані."
        buttonText="Зберегти"
        questionsCount={questions.length}
        startDate={testMeta.startTime ? testMeta.startTime.toLocaleDateString('uk-UA') : '-'}
        startTime={testMeta.startTime ? testMeta.startTime.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) : '-'}
      />
    </div>
  );
};

export default TestEditingMainPage;