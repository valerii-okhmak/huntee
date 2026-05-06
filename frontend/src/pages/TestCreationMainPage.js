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
import ImportQuestionsModal from '../components/modal_windows/ImportQuestionsModal';

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

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const creatorRef = useRef(null);

  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_QUESTIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [testLevels, setTestLevels] = useState(() => {
    const saved = localStorage.getItem(STORAGE_LEVELS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [questionsCount, setQuestionsCount] = useState(questions.length);

  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem(STORAGE_QUESTIONS_KEY, JSON.stringify(questions));
      setQuestionsCount(questions.length);
    }
  }, [questions, isEditMode]);

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

  useEffect(() => {
    const fetchData = async () => {
      if (!isEditMode) return;
  
      try {
        const token = getAccessToken();
        const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };

        const testRes = await axios.get(`/api/tests/${testId}`, { headers });
        const fetchedLevels = testRes.data?.levels || [];
        
        const mappedLevels = fetchedLevels.map(l => ({
           id: l.id || l.levelId,
           name: l.name,
           points: l.weight || 1.0,
           questionsLimit: l.questionsLimit || '' 
        }));
        setTestLevels(mappedLevels);

        const { data: questionsData } = await axios.get(`/api/tests/${testId}/questions`, { headers });
  
        const mappedQuestions = questionsData.map(q => {
           const lvl = mappedLevels.find(l => l.id === q.levelId);
           return { 
               ...q, 
               level: lvl ? lvl.name : "", 
               points: q.customWeight || q.weight || 1.0 
           };
        });

        setQuestions(mappedQuestions);
        setOriginalQuestions(mappedQuestions);
        setQuestionsCount(mappedQuestions.length);

      } catch (e) {
        console.error("Помилка завантаження даних тесту:", e);
      }
    };
  
    fetchData();
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
      points: aiQ.customWeight || aiQ.weight || 1, 
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
          language: params.language,
          customInstructions: params.customInstructions, // Відправляємо інструкції
          autoLevel: params.levelStrategy === 'auto'     // Кажемо ШІ придумувати рівні
        },
        { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } }
      );

      if (data && data.length > 0) {
        let newLevelsToAdd = [];

        const newQuestions = data.map(aiQ => {
           const mapped = mapAiQuestionToFrontend(aiQ);
           mapped.points = params.points; 

           // Визначаємо рівень для питання на основі стратегії
           if (params.levelStrategy === 'specific') {
               mapped.level = params.targetLevel;
           } else if (params.levelStrategy === 'auto') {
               // Якщо ШІ прислав suggestedLevel, використовуємо його
               const lvlName = aiQ.suggestedLevel || "Загальні питання";
               mapped.level = lvlName;
               
               // Збираємо нові рівні, яких ще немає
               if (!testLevels.some(l => l.name === lvlName) && !newLevelsToAdd.some(l => l.name === lvlName)) {
                   newLevelsToAdd.push({ name: lvlName, points: params.points, questionsLimit: null });
               }
           } else {
               mapped.level = ""; // Без рівня
           }

           return mapped;
        });

        // Оновлюємо рівні, якщо ШІ створив нові
        if (newLevelsToAdd.length > 0) {
            setTestLevels(prev => [...prev, ...newLevelsToAdd]);
        }

        // Додаємо питання
        setQuestions(prev => {
          const updated = [...prev, ...newQuestions];
          setQuestionsCount(updated.length);
          return updated;
        });
        
        setMode('preview'); 
        setIsAiModalOpen(false);
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
        levels: testLevels.map((lvl, index) => ({
           id: lvl.id || null, 
           name: lvl.name,
           weight: parseFloat(lvl.points) || 1.0,
           orderIndex: index,
           questionsLimit: parseInt(lvl.questionsLimit) || null 
        }))
      };
  
      let currentTestId = testId;
      let savedLevels = [];

      if (isEditMode) {
        const res = await axios.put(`/api/tests/${currentTestId}`, testPayload, { headers });
        savedLevels = res.data?.levels || [];
      } else {
        const res = await axios.post(`/api/tests`, testPayload, { headers });
        currentTestId = res.data?.testId;
        savedLevels = res.data?.levels || [];
      }

      const isValidUUID = (id) => {
        if (!id) return false;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
      };
      
      const questionsPayload = questions.map((q, i) => {
        const matchedLevel = savedLevels.find(l => l.name === q.level);

        const payload = {
          questionText: q.questionText,
          questionType: q.questionType,
          comment: q.comment || "",
          customWeight: parseFloat(q.points) || 1.0, 
          orderIndex: i,
          levelId: matchedLevel ? (matchedLevel.id || matchedLevel.levelId) : null
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
        await axios.put(`/api/tests/${currentTestId}/questions/bulk`, questionsPayload, { headers });
      } else {
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

  const handleMoveQuestionToLevel = (questionIndex, newLevelName) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[questionIndex] = { ...updated[questionIndex], level: newLevelName };
      return updated;
    });
  };

  const handleDeleteMultipleQuestions = (indexesToDelete) => {
      const indexesSet = new Set(indexesToDelete);
      setQuestions(prev => {
        const updated = prev.filter((_, idx) => !indexesSet.has(idx));
        setQuestionsCount(updated.length);
        return updated;
      });
    };

  const handleReorderQuestions = (draggedIndices, targetLevel, targetIndex) => {
    setQuestions(prev => {
      const updated = [...prev];
      
      const draggedItems = draggedIndices.map(idx => ({
        ...updated[idx],
        level: targetLevel
      }));

      const remainingItems = updated.filter((_, idx) => !draggedIndices.includes(idx));

      let insertIndex = remainingItems.length; 

      if (targetIndex !== null) {
          const targetQuestion = updated[targetIndex];
          const foundIndex = remainingItems.findIndex(q => q === targetQuestion);
          if (foundIndex !== -1) {
              insertIndex = foundIndex;
          }
      }

      remainingItems.splice(insertIndex, 0, ...draggedItems);

      return remainingItems;
    });
  };

  const handleImportSubmit = async (file, importedPoints, importedLevel) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = getAccessToken();
      const response = await axios.post('/api/tests/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });

      const parsedPoints = parseFloat(importedPoints) || 1;
      const importedQuestions = response.data.map(q => ({
          ...q,
          id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          points: parsedPoints,
          level: importedLevel 
      }));

      setQuestions(prev => {
        const updated = [...prev, ...importedQuestions];
        setQuestionsCount(updated.length);
        return updated;
      });
      setIsImportModalOpen(false);
    } catch (error) {
      console.error("Помилка імпорту:", error);
    }
};

  const handleAddQuestionFromZone = (levelName) => {
      setMode('create');
      setTimeout(() => {
          if (creatorRef.current) {
              creatorRef.current.prepareNewQuestion(levelName);
          }
      }, 0);
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
          existingLevels={testLevels}
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
          onMoveQuestionToLevel={handleMoveQuestionToLevel}
          onDeleteMultipleQuestions={handleDeleteMultipleQuestions}
          onReorderQuestions={handleReorderQuestions}
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
          onAddQuestionClick={handleAddQuestionFromZone} 
          onOpenAiModal={() => setIsAiModalOpen(true)}  
           onOpenImportModal={() => setIsImportModalOpen(true)} 
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

      <ImportQuestionsModal 
          isOpen={isImportModalOpen} 
          onClose={() => setIsImportModalOpen(false)} 
          onImport={handleImportSubmit} 
          existingLevels={testLevels} 
      />

    </div>
  );
};

export default TestCreationMainPage;