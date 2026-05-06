import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import TestCreationMainCount from '../components/testCreationMain/TestCreationMainCount/TestCreationMainCount';
import TestCreationMainCreator from '../components/testCreationMain/TestCreationMainCreator/TestCreationMainCreator';
import TestCreationMainPreview from '../components/testCreationMain/TestCreationMainPreview/TestCreationMainPreview';
import ConfirmationTestCreateModal from '../components/modal_windows/ConfirmTestCreateModal';
import AiGenerationModal from '../components/modal_windows/AiGenerationModal';
import Loader from '../components/loader/Loader';
import { getAccessToken } from '../utils/auth';

const STORAGE_QUESTIONS_KEY = 'tc_questions_list';
const STORAGE_META_KEY = 'test_creation_draft';
const STORAGE_MODE_KEY = 'tc_page_mode';
const STORAGE_EDIT_INDEX_KEY = 'tc_editing_index';
const STORAGE_LEVELS_KEY = 'tc_test_levels'; 

const TestCreationMainPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const passed = location.state?.testMeta || null;
  const isEditMode = location.state?.mode === 'edit';
  const testId = location.state?.testId;

  const [mode, setMode] = useState(() => {
    if (isEditMode) return 'preview';
    return localStorage.getItem(STORAGE_MODE_KEY) || 'preview';
  });
  
  const [editingIndex, setEditingIndex] = useState(() => {
    const saved = localStorage.getItem(STORAGE_EDIT_INDEX_KEY);
    return saved !== null ? parseInt(saved) : null;
  });
  
  const [originalQuestions, setOriginalQuestions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const creatorRef = useRef(null);

  // Стан для питань
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_QUESTIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Стан для рівнів
  const [testLevels, setTestLevels] = useState(() => {
    const saved = localStorage.getItem(STORAGE_LEVELS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [questionsCount, setQuestionsCount] = useState(questions.length);

  // Збереження питань в локальне сховище
  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem(STORAGE_QUESTIONS_KEY, JSON.stringify(questions));
      setQuestionsCount(questions.length);
    }
  }, [questions, isEditMode]);

  // Збереження рівнів в локальне сховище
  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem(STORAGE_LEVELS_KEY, JSON.stringify(testLevels));
    }
  }, [testLevels, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem(STORAGE_MODE_KEY, mode);
      if (editingIndex !== null) {
        localStorage.setItem(STORAGE_EDIT_INDEX_KEY, editingIndex.toString());
      } else {
        localStorage.removeItem(STORAGE_EDIT_INDEX_KEY);
      }
    }
  }, [mode, editingIndex, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      setMode('preview');
    }
  }, [isEditMode]);

  // Завантаження існуючих питань (для режиму редагування)
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!isEditMode) return;
  
      try {
        const token = getAccessToken();
        const { data } = await axios.get(
          `/api/tests/${testId}/questions`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          }
        );
  
        setQuestions(data);
        setOriginalQuestions(data);
        setQuestionsCount(data.length);
        
        // Відновлюємо унікальні рівні з отриманих питань
        const uniqueLevelsMap = new Map();
        data.forEach(q => {
           if (q.level && !uniqueLevelsMap.has(q.level)) {
               uniqueLevelsMap.set(q.level, { name: q.level, points: q.points || 1 });
           }
        });
        setTestLevels(Array.from(uniqueLevelsMap.values()));

      } catch (e) {
        console.error(e);
      }
    };
  
    fetchQuestions();
  }, [isEditMode, testId]);  

  const [testMeta, setTestMeta] = useState(() => ({
    testName: passed?.testName || t('testCreationMain.defaultTestName'),
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

  const handleEditStart = (index) => {
    setEditingIndex(index);
    setMode('create'); 

    setTimeout(() => {
      if (creatorRef.current) {
        creatorRef.current.loadQuestion(questions[index]);
      }
    }, 0);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setMode('preview');
    localStorage.removeItem(STORAGE_EDIT_INDEX_KEY);
    if (creatorRef.current) {
        creatorRef.current.resetForm(); 
    }
  };

  const handleEditConfirm = () => {
    const updatedQuestion = creatorRef.current?.getCurrentQuestionAndReset();
    if (!updatedQuestion) return;

    setQuestions(prev => {
      const newList = [...prev];
      if (newList[editingIndex]?.id) {
        updatedQuestion.id = newList[editingIndex].id;
      }
      newList[editingIndex] = updatedQuestion;
      return newList;
    });

    setEditingIndex(null);
    setMode('preview');
    localStorage.removeItem(STORAGE_EDIT_INDEX_KEY);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      setQuestionsCount(updated.length);
      return updated;
    });
    if (index === editingIndex) {
        setEditingIndex(null);
        setMode('preview');
    }
  };

  const handleTryPublish = () => {
    if (questions.length === 0) {
      setShowError(true);
      return;
    }
    setIsModalOpen(true);
  };

  const mapAiQuestionToFrontend = (aiQ) => {
    const questionBase = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, 
      questionText: aiQ.questionText,
      questionType: aiQ.questionType, 
      comment: aiQ.comment || "",
      points: aiQ.weight || 1,
      level: ""
    };

    if (aiQ.questionType === 'SINGLE_CHOICE' || aiQ.questionType === 'MULTIPLE_CHOICE') {
      questionBase.choiceOptions = aiQ.choiceOptions 
        ? aiQ.choiceOptions.map((opt, idx) => ({
            optionText: opt.optionText,
            isCorrect: opt.correct, 
            orderIndex: idx,
            imageUrl: opt.imageUrl || null
          }))
        : [];
    }

    if (aiQ.questionType === 'TEXT') {
      questionBase.textAnswer = {
        correctText: aiQ.textAnswer?.correctText || "",
        isCaseSensitive: aiQ.textAnswer?.caseSensitive || false
      };
    }

    if (aiQ.questionType === 'CODE') {
      const rawTestCases = aiQ.codeAnswer?.testCases || [];
      const testCasesString = JSON.stringify(rawTestCases);

      questionBase.codeAnswer = {
        language: aiQ.codeAnswer?.language || "java",
        methodName: aiQ.codeAnswer?.methodName || "solution",
        templateCode: aiQ.codeAnswer?.templateCode || "",
        testCases: testCasesString 
      };
    }

    return questionBase;
  };

  const handleAiGenerate = async (params) => {
    try {
      setAiLoading(true);
      
      const token = getAccessToken();
      
      const { data } = await axios.post(
        '/api/ai/tests/generate',
        {
          topic: params.topic,
          count: params.count,
          difficulty: params.difficulty,
          questionType: params.type,
          language: params.language
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      if (data && data.length > 0) {
        const newQuestions = data.map(mapAiQuestionToFrontend);

        setQuestions(prev => {
          const updated = [...prev, ...newQuestions];
          setQuestionsCount(updated.length);
          return updated;
        });

        setMode('preview'); 
      }
    } catch (e) {
      console.error("AI Generation failed:", e);
    } finally {
      setAiLoading(false);
    }
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
  
      let currentTestId = testId;

      const isValidUUID = (id) => {
        if (!id) return false;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
      };
      
      const questionsPayload = questions.map((q, i) => {
        const payload = {
          questionText: q.questionText,
          questionType: q.questionType,
          comment: q.comment || "",
          weight: parseFloat(q.points) || 1.0,
          orderIndex: i,
          level: q.level || null // Додаємо рівень для бекенду
        };

        if (isValidUUID(q.id)) {
          payload.id = q.id;
        }

        if (q.questionType === 'SINGLE_CHOICE' || q.questionType === 'MULTIPLE_CHOICE') {
          payload.choiceOptions = q.choiceOptions;
        } else if (q.questionType === 'TEXT') {
          payload.textAnswer = q.textAnswer;
        } else if (q.questionType === 'CODE') {
          payload.codeAnswer = q.codeAnswer;
        }

        return payload;
      });
  
      if (isEditMode) {
        await axios.put(`/api/tests/${currentTestId}`, testPayload, { headers });
        await axios.put(`/api/tests/${currentTestId}/questions/bulk`, questionsPayload, { headers });
      } else {
        const res = await axios.post(`/api/tests`, testPayload, { headers });
        currentTestId = res.data?.testId;
        await axios.post(`/api/tests/${currentTestId}/questions/bulk`, questionsPayload, { headers });
      }

      const draftKeys = [
        STORAGE_META_KEY, STORAGE_QUESTIONS_KEY, STORAGE_LEVELS_KEY, 'tc_current_creator_q',
        'tc_name', 'tc_field', 'tc_level', 'tc_city', 'tc_desc', 'tc_resp',
        'tc_start_date', 'tc_end_date', 'tc_time', 'tc_type', 'tc_q_sort',
        'tc_a_sort', 'tc_results'
      ];
      [STORAGE_MODE_KEY, STORAGE_EDIT_INDEX_KEY].forEach(k => localStorage.removeItem(k));
      draftKeys.forEach(key => localStorage.removeItem(key));
  
      navigate('/viewingtests');
    } catch (e) {
      console.error("Помилка публікації тесту:", e);
      if (e.response && e.response.data) {
        console.error("Деталі помилки з бекенду:", e.response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const localeDate = i18n.language === 'uk' ? 'uk-UA' : 'en-US';

  return (
    <div className='page'>
      <GeneralTestInfoHeader
        field={testMeta.sphere}
        title={testMeta.testName}
        location={testMeta.city}
        date={testMeta.startTime ? testMeta.startTime.toLocaleDateString(localeDate) : ''}
        time={testMeta.startTime ? testMeta.startTime.toLocaleTimeString(localeDate, { hour: '2-digit', minute: '2-digit' }) : ''}
      />

      <TestCreationMainCount questionsCount={questionsCount} />

      {mode === 'create' ? (
      <TestCreationMainCreator 
          ref={creatorRef} 
          globalSphere={testMeta.sphere} 
          existingLevels={testLevels} // Передаємо рівні в Creator
          onImportSuccess={(newQuestions) => {
              setQuestions(prev => {
                  const updated = [...prev, ...newQuestions];
                  setQuestionsCount(updated.length);
                  return updated;
              });
              setMode('preview'); 
          }}
      />
      ) : (
        <TestCreationMainPreview
          questions={questions}
          levels={testLevels} 
          onAddLevel={(newLevel) => setTestLevels(prev => [...prev, newLevel])}
          
          onEditLevel={(oldLevelName, updatedLevel) => {
            setTestLevels(prev => prev.map(l => l.name === oldLevelName ? updatedLevel : l));
            
            if (oldLevelName !== updatedLevel.name) {
              setQuestions(prev => prev.map(q => 
                q.level === oldLevelName ? { ...q, level: updatedLevel.name } : q
              ));
            }
          }}

          onDeleteLevel={(levelName) => {
            setTestLevels(prev => prev.filter(l => l.name !== levelName));
            setQuestions(prev => prev.map(q => q.level === levelName ? { ...q, level: "" } : q));
          }}
          onDeleteQuestion={handleDeleteQuestion}
          onEditQuestion={handleEditStart} 
          showError={showError} 
        />
      )}

        <div className='testCreationMainButtons__container'>
          {mode === 'create' ? (
            editingIndex !== null ? (
              <>
                 <button className='testCreationMainButtons__button white-btn' onClick={handleEditCancel}>
                   {t('testCreationMain.buttons.cancelEdit')}
                 </button>
                 <button className='testCreationMainButtons__button black-btn' onClick={handleEditConfirm}>
                   {t('testCreationMain.buttons.confirmEdit')}
                 </button>
              </>
            ) : (
              <>
                <button 
                  className='testCreationMainButtons__button ai-btn' 
                  onClick={() => setIsAiModalOpen(true)}
                >
                  {t('testCreationMain.buttons.aiGenerate')}
                </button>

                <button className='testCreationMainButtons__button white-btn' onClick={handleNextQuestion}>
                  {t('testCreationMain.buttons.addQuestion')}
                </button>
                <button
                  className='testCreationMainButtons__button black-btn'
                  onClick={() => {
                    addCurrentQuestionIfExists();
                    setMode('preview');
                  }}
                >
                  {t('testCreationMain.buttons.viewResult')}
                </button>
              </>
            )
          ) : (
            <>
              <button className='testCreationMainButtons__button white-btn' onClick={() => setMode('create')} disabled={loading}>
                {t('testCreationMain.buttons.backToCreate')}
              </button>
              <button className='testCreationMainButtons__button black-btn' onClick={handleTryPublish} disabled={loading}>
                {t('testCreationMain.buttons.finishCreation')}
              </button>
            </>
          )}
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
        startDate={testMeta.startTime ? testMeta.startTime.toLocaleDateString(localeDate) : t('testCreationMain.notSpecified')}
        startTime={testMeta.startTime ? testMeta.startTime.toLocaleTimeString(localeDate, { hour: '2-digit', minute: '2-digit' }) : t('testCreationMain.notSpecified')}
      />

      <AiGenerationModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerate={handleAiGenerate}
        loading={aiLoading}
        defaultTopic={testMeta.testName}
        defaultLevel={testMeta.level}
      />
    </div>
  );
};

export default TestCreationMainPage;