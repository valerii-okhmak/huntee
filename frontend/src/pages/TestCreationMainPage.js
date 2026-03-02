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

const TestCreationMainPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const passed = location.state?.testMeta || null;
  const isEditMode = location.state?.mode === 'edit';
  const testId = location.state?.testId;

  const [mode, setMode] = useState('create');
  const [editingIndex, setEditingIndex] = useState(null);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

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
  };

  const handleEditConfirm = () => {
    const updatedQuestion = creatorRef.current?.getCurrentQuestionAndReset();
    
    if (!updatedQuestion) return;

    setQuestions(prev => {
      const newList = [...prev];
      const originalId = newList[editingIndex].id;
      if (originalId) {
        updatedQuestion.id = originalId;
      }
      
      newList[editingIndex] = updatedQuestion;
      return newList;
    });

    setEditingIndex(null);
    setMode('preview');
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
      points: aiQ.weight || 1
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
  
      if (isEditMode) {
        await axios.put(`/api/tests/${currentTestId}`, testPayload, { headers });

        const originalIds = originalQuestions.map(q => q.id);
        const currentIds = questions.filter(q => q.id).map(q => q.id);
        const toDelete = originalIds.filter(id => !currentIds.includes(id));

        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const isTempId = q.id && String(q.id).startsWith('ai_');
          const payload = { ...q };
          if (isTempId) delete payload.id; 

          if (q.id && !isTempId) {
            await axios.put(`/api/questions/${q.id}`, { ...payload, orderIndex: i }, { headers });
          } else {
            await axios.post(`/api/tests/${currentTestId}/questions`, { ...payload, orderIndex: i }, { headers });
          }
        }

        for ( const id of toDelete) {
          if (id) await axios.delete(`/api/questions/${id}`, { headers });
        }
        
      } else {
        const res = await axios.post(`/api/tests`, testPayload, { headers });
        currentTestId = res.data?.testId;

        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const isTempId = q.id && String(q.id).startsWith('ai_');
          const payload = { ...q };
          if (isTempId) delete payload.id;

          await axios.post(
            `/api/tests/${currentTestId}/questions`,
            { ...payload, orderIndex: i, weight: payload.points },
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
        <TestCreationMainCreator ref={creatorRef} />
      ) : (
        <TestCreationMainPreview
          questions={questions}
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
              <button className='testCreationMainButtons__back white-btn' onClick={() => setMode('create')} disabled={loading}>
                {t('testCreationMain.buttons.backToCreate')}
              </button>
              <button className='testCreationMainButtons__publish black-btn' onClick={handleTryPublish} disabled={loading}>
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