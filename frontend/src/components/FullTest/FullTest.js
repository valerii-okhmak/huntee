import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-csharp";
import "prismjs/themes/prism.css"; 

import { getAccessToken } from "../../utils/auth";
import ProctoringTracker from "../../utils/ProctoringTracker";
import "./FullTest.css";
import ConfirmTestEndModal from "../modal_windows/ConfirmTestEndModal";
import StartTestErrorModal from "../modal_windows/StartTestErrorModal";
import Loader from "../loader/Loader";

// Перехоплення закриття вкладки (хрестиком) або оновлення сторінки (F5)
const usePrompt = (message, when = true) => {
  useEffect(() => {
    if (!when) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [message, when]);
};

const TestPage = ({ testType }) => { 
  const { t } = useTranslation();
  const { testId } = useParams(); 
  const navigate = useNavigate();
  const getLocalKey = (tId) => `test_progress_${tId}`;

  const [attemptData, setAttemptData] = useState(null); 
  const [current, setCurrent] = useState(0); 
  
  const [answers, setAnswers] = useState({}); 
  const [outputMap, setOutputMap] = useState({}); 

  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null); 
  
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [saveStatus, setSaveStatus] = useState('saved');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [unansweredLabels, setUnansweredLabels] = useState("");

  const [isStartTestErrorModalOpen, setIsStartTestErrorModalOpen] = useState(false);
  const [startErrorMessage, setStartErrorMessage] = useState("");

  const answersRef = useRef({});
  const attemptDataRef = useRef(null);
  const proctoringTrackerRef = useRef(null);
  
  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  usePrompt(t('testPage.promptMessage', 'Точно хочете вийти?'), !!attemptData);

  // --- СПІЛЬНА ФУНКЦІЯ ДЛЯ ВІДКРИТТЯ МОДАЛКИ ЗАВЕРШЕННЯ ---
  const triggerEndModal = async () => {
    setIsSubmitting(true);
    try {
        await saveAnswerToBackend(currentRef.current);
    } catch (e) {
    } finally {
        setIsSubmitting(false);
    }

    const details = getUnansweredDetails();
    setUnansweredCount(details.count);
    setUnansweredLabels(details.labels);
    
    setIsConfirmModalOpen(true);
  };

  // --- ХИТРИЙ ТРЮК №2: БЛОКУЄМО І БРАУЗЕР, І ХЕДЕР ---
  useEffect(() => {
    if (!attemptData) return; 

    // Блокуємо "Назад" у браузері
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.pathname);
      triggerEndModal(); // Викликаємо модалку!
    };

    // Блокуємо переходи через <Link> у Хедері та інші <a>
    const handleGlobalClick = (e) => {
      const link = e.target.closest('a'); // Шукаємо, чи клікнули по посиланню
      
      if (link && link.href) {
        // Перевіряємо, чи посилання веде з цієї сторінки
        const isSamePage = link.href === window.location.href || link.getAttribute('href').startsWith('#');
        
        if (!isSamePage) {
          e.preventDefault();   // Зупиняємо дефолтний перехід браузера
          e.stopPropagation();  // Зупиняємо подію для React Router
          triggerEndModal();    // Викликаємо модалку!
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    // capture: true ловить клік ДО того, як React Router його обробить!
    document.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [attemptData]);
  // --------------------------------------------------------------------------

  const handleCloseErrorModal = () => {
    setIsStartTestErrorModalOpen(false);
    navigate(-1);
  };

  useEffect(() => {
    const startTest = async () => {
      console.log(`Starting test ID: ${testId}`);
      try {
        const token = getAccessToken();
        const response = await axios.post(
          `/api/tests/${testId}/start`,
          {}, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        const attempt = response.data;
        setAttemptData(attempt);
        attemptDataRef.current = attempt;

        if (attempt.hasCompletedAttempt) {
             console.log("Already completed.");
             navigate(`/testreview/${attempt.completedAttemptId}`);
             return;
        }

        if (!proctoringTrackerRef.current) {
             proctoringTrackerRef.current = new ProctoringTracker(
                 attempt.attemptId, 
                 (type, desc) => {
                     console.log(`Увага! Зафіксовано порушення: ${desc}. Ця дія записана.`);
                 }
             );
        }

        if (attempt.isFixedTime && attempt.endTime) {
          const endTime = new Date(attempt.endTime).getTime();
          const now = new Date().getTime();
          const secondsRemaining = Math.floor((endTime - now) / 1000);
          setTimeLeft(secondsRemaining);
        } else {
          setTimeLeft(null); 
        }
        setLoading(false);

        const savedProgress = localStorage.getItem(getLocalKey(testId));
        if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            setAnswers(parsed);
            answersRef.current = parsed;
            console.log("🔄 Progress restored from LocalStorage");
        }

      } catch (error) {
        console.error("🔍 Start Error:", error);
        let message = t('testPage.errors.startFailed');
        if (error.response?.data?.message) {
            message = error.response.data.message;
        }
        setStartErrorMessage(message);     
        setIsStartTestErrorModalOpen(true); 
        setLoading(false);                 
      }
    };

    if (testId) startTest();
    return () => {
      if (proctoringTrackerRef.current) {
        proctoringTrackerRef.current.stop();
        proctoringTrackerRef.current = null;
      }
    };
  }, [testId, navigate, t]);

  // --- ТАЙМЕР ---
  useEffect(() => {
    if (!attemptData || !attemptData.isFixedTime || !attemptData.endTime) return;

    const endTimeMs = new Date(attemptData.endTime).getTime();

    const timer = setInterval(() => {
      const nowMs = new Date().getTime();
      const secondsRemaining = Math.floor((endTimeMs - nowMs) / 1000);

      if (secondsRemaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        console.log("🔍 Time limit reached!");
        finishTestForce(); 
      } else {
        setTimeLeft(secondsRemaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [attemptData]);

  const formatTime = (sec) => {
    if (sec < 0) sec = 0;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return { h, m, s };
  };

  const saveAnswerToBackend = async (questionIndex) => {
    const currentAttempt = attemptDataRef.current;
    if (!currentAttempt) return;
    
    const question = currentAttempt.questions[questionIndex];
    const currentAnswer = answersRef.current[question.questionId];

    if (currentAnswer === undefined || currentAnswer === null) return;
    if (typeof currentAnswer === 'string' && currentAnswer.trim() === '') return;
    if (Array.isArray(currentAnswer) && currentAnswer.length === 0) return;

    setSaveStatus('saving');
    try {
      const token = getAccessToken();
      let body = { questionType: question.questionType };

      if (question.questionType === 'SINGLE_CHOICE') {
         body.selectedOptionIds = [currentAnswer]; 
      } 
      else if (question.questionType === 'MULTIPLE_CHOICE') {
         body.selectedOptionIds = currentAnswer;
      } 
      else if (question.questionType === 'TEXT' || question.questionType === 'CODE') {
         body.givenText = currentAnswer;
      }

      await axios.post(
        `/api/attempts/${currentAttempt.attemptId}/questions/${question.questionId}/answer`,
        body,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setSaveStatus('saved');

    } catch (error) {
      if (error.response && error.response.status === 400) {
          console.warn("Backend error 400 (Duplicate). Treating as SUCCESS.");
          setSaveStatus('saved');
          return; 
      }
      
      console.error("Save FAILED:", error);
      setSaveStatus('error');
      throw error;
    }
  };

  const saveTimeoutRef = useRef(null);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => {
      const newState = { ...prev, [questionId]: value };
      answersRef.current = newState;
      
      const currentQuestion = attemptData.questions[current];
      
      if (currentQuestion.questionType.includes('CHOICE')) {
          localStorage.setItem(getLocalKey(testId), JSON.stringify(newState));
      } else {
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
          
          saveTimeoutRef.current = setTimeout(() => {
              localStorage.setItem(getLocalKey(testId), JSON.stringify(newState));
              console.log("💾 Auto-saved to LocalStorage after 3s pause");
          }, 3000);
      }
      
      return newState;
    });
    
    setSaveStatus('unsaved'); 
  };

  const handleNext = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
        await saveAnswerToBackend(current);
        if (current < attemptData.questions.length - 1) {
            setCurrent(prev => prev + 1);
        }
    } catch (e) {
        console.error("Navigation blocked by save error");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleJumpToQuestion = async (index) => {
      if (index === current || isSubmitting) return;
      setIsSubmitting(true);
      try {
          await saveAnswerToBackend(current);
          setCurrent(index);
      } catch(e) {
          console.error("Jump blocked");
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleRunCode = async (question) => {
    const code = answers[question.questionId];
    if (!code) return;

    try {
        setOutputMap(prev => ({ ...prev, [question.questionId]: t('testPage.compiling') }));
        const token = getAccessToken();
        const response = await axios.post(
            `/api/attempts/${attemptData.attemptId}/questions/${question.questionId}/run`,
            code, 
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'text/plain' } }
        );

        const result = response.data; 
        let outputText = result.allPassed ? t('testPage.codeResult.pass') : t('testPage.codeResult.fail');
        result.results.forEach((res, idx) => {
            outputText += `\nTest Case #${idx + 1}:\nInput: ${res.input}\nExpected: ${res.expectedOutput}\nActual: ${res.actualOutput}\n${res.passed ? "Result: PASS" : "Result: FAIL"}\n`;
        });
        setOutputMap(prev => ({ ...prev, [question.questionId]: outputText }));
    } catch (error) {
        setOutputMap(prev => ({ ...prev, [question.questionId]: t('testPage.errors.runCode') }));
    }
  };

  const confirmFinishTest = async () => {
      console.log("🔍 Confirming finish...");
      if (proctoringTrackerRef.current) {
          proctoringTrackerRef.current.stop();
          proctoringTrackerRef.current = null;
      }
      try {
        const token = getAccessToken();
        const currentAttemptId = attemptDataRef.current.attemptId;

        const response = await axios.post(
            `/api/attempts/${currentAttemptId}/finish`,
            {},
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        console.log("🔍 Finish SUCCESS. Data:", response.data);
        localStorage.removeItem(getLocalKey(testId)); 
        
        const redirectId = response.data?.attemptId || currentAttemptId;

        if (redirectId) {
             navigate(`/testreview/${redirectId}`, { state: { fromFinish: true } });
        } else {
             alert(t('testPage.errors.noId'));
             navigate('/test-dashboard');
        }

      } catch (error) {
        console.error("Finish FAILED:", error);
        alert(t('testPage.errors.finishFailed'));
      }
  };

  const finishTestForce = async () => {
      try { await saveAnswerToBackend(current); } catch(e){}
      await confirmFinishTest();
  };

  const getUnansweredDetails = () => {
    if (!attemptData) return { count: 0, labels: "" };
    const indices = attemptData.questions
      .map((q, index) => {
        const ans = answersRef.current[q.questionId];
        const isEmpty = (ans === undefined || ans === null || ans === "" || (Array.isArray(ans) && ans.length === 0));
        return isEmpty ? index + 1 : null;
      })
      .filter(num => num !== null);

    return {
      count: indices.length,
      labels: indices.length > 0 ? ` (${indices.join(", ")})` : ""
    };
  };

  const highlightCode = (code, language) => {
    let lang = languages.js;
    if (language === 'java') lang = languages.java;
    if (language === 'python') lang = languages.python;
    if (language === 'csharp') lang = languages.csharp;
    return highlight(code, lang);
  };

  const renderQuestion = (q) => {
    const answer = answers[q.questionId];

    switch (q.questionType) {
      case "SINGLE_CHOICE":
        return (
          <div className="choices">
            {q.choiceOptions.map((opt) => (
              <label className="custom-radio" key={opt.optionId}>
                <input
                  className="choices-input"
                  type="radio"
                  name={`q-${q.questionId}`} 
                  value={opt.optionId}
                  checked={answer === opt.optionId}
                  onChange={() => handleAnswerChange(q.questionId, opt.optionId)}
                />
                <span className="radio-circle-blue" />
                {opt.optionText}
              </label>
            ))}
          </div>
        );

      case "MULTIPLE_CHOICE":
        const selectedIds = Array.isArray(answer) ? answer : [];
        return (
          <div className="choices">
            {q.choiceOptions.map((opt) => (
              <label className="custom-checkbox" key={opt.optionId}>
                <input
                  className="choices-input"
                  type="checkbox"
                  checked={selectedIds.includes(opt.optionId)}
                  onChange={() => {
                    let newIds = selectedIds.includes(opt.optionId) 
                      ? selectedIds.filter(id => id !== opt.optionId) 
                      : [...selectedIds, opt.optionId];
                    handleAnswerChange(q.questionId, newIds);
                  }}
                />
                <span className="checkbox-square-blue" />
                {opt.optionText}
              </label>
            ))}
          </div>
        );

      case "TEXT":
        return (
          <textarea
            rows="6"
            value={answer || ""}
            onChange={(e) => handleAnswerChange(q.questionId, e.target.value)}
            placeholder={t('testPage.placeholder')}
            style={{width: '100%', padding: '10px', marginTop: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
          />
        );

      case "CODE":
        return (
          <div style={{ marginTop: '10px' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
              <span style={{fontWeight: 'bold', color: '#555'}}>{t('testPage.language')}: {q.codeLanguage || "text"}</span>
              <button className="run-button" onClick={() => handleRunCode(q)} disabled={!answer}>{t('testPage.runCode')}</button>
            </div>
            
            <div className="code-editor-wrapper" style={{ border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden' }}>
                <Editor
                    value={answer || q.templateCode || ""}
                    onValueChange={(code) => handleAnswerChange(q.questionId, code)}
                    highlight={(code) => highlightCode(code, q.codeLanguage || 'javascript')}
                    padding={15}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 14,
                        backgroundColor: '#f5f5f5',
                        minHeight: '200px'
                    }}
                />
            </div>
            {outputMap[q.questionId] && (
              <div className="code-output" style={{marginTop: '15px', padding: '10px', background: '#222', color: '#fff', borderRadius: '5px', fontFamily: 'monospace', whiteSpace: 'pre-wrap'}}>
                {outputMap[q.questionId]}
              </div>
            )}
          </div>
        );

      default:
        return <p>{t('testPage.unknownType')}</p>;
    }
  };

  if (loading) return <div className="page"><Loader /></div>;
  if (!attemptData) return <div className="page">{t('testPage.errors.loadData')}</div>;

  const currentQuestion = attemptData.questions[current];
  const { h, m, s } = timeLeft !== null ? formatTime(timeLeft) : { h:0, m:0, s:0 };

  const generatePagination = (currentIndex, totalQuestions) => {
    const currentPage = currentIndex + 1;

    if (totalQuestions <= 7) {
      return Array.from({ length: totalQuestions }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalQuestions];
    }

    if (currentPage >= totalQuestions - 3) {
      return [1, '...', totalQuestions - 4, totalQuestions - 3, totalQuestions - 2, totalQuestions - 1, totalQuestions];
    }

    return [
      1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalQuestions
    ];
  };

  const totalQuestions = attemptData.questions.length;
  const paginationItems = generatePagination(current, totalQuestions);

  return (
    <div className={`FullTest ${testType === "softskills" ? 'FullTest-gradient' : 'FullTest-regular'}`} style={{userSelect: 'none'}}>
      
      {testType !== "softskills" &&
        <div className="header-bar">
            <div className="top-section">
              <div className="top-line"><div className="category">{attemptData.sphere}</div></div>
              <h1 className="fulltest-title">{attemptData.testName}</h1>
              <div className="top-line">
                  <span style={{fontSize: '12px', fontWeight:'bold', color: saveStatus === 'error' ? 'red' : saveStatus === 'saving' ? 'orange' : 'green'}}>
                      {saveStatus === 'saving' ? t('testPage.status.saving') : saveStatus === 'error' ? t('testPage.status.error') : t('testPage.status.saved')}
                  </span>
              </div>
            </div>
          
          {attemptData.isFixedTime && timeLeft !== null && (
            <div className="timer-box">
              <div className="time"><span className="time-val">{h}</span><span className="time-label">{t('testPage.timer.hours')}</span></div>
              <div className="time"><span className="time-val">{m}</span><span className="time-label">{t('testPage.timer.minutes')}</span></div>
              <div className="time"><span className="time-val">{s}</span><span className="time-label">{t('testPage.timer.seconds')}</span></div>
            </div>
          )}
        </div>
      }

      <div className={`Num ${testType === "softskills" ? 'Num-bg' : 'Num-regular'}`}>
        {paginationItems.map((item, index) => (
          <button
            key={index}
            onClick={() => item !== '...' && handleJumpToQuestion(item - 1)}
            className={item === current + 1 ? "active" : ""}
            disabled={isSubmitting || item === '...'} 
          >
            {item}
          </button>
        ))}
      </div>

      <div className={`test-container ${testType === "softskills" ? 'test-container-transparent' : ''}`}>
        <h2 className="question">
            <span style={{color:'#888', marginRight:'10px'}}>#{current+1}</span>
            {currentQuestion.questionText}
        </h2>
        
        <div className="answer">
            {renderQuestion(currentQuestion)}
        </div>

        <div className="test-buttons">
          {current < attemptData.questions.length - 1 ? (
            <button 
                className={`next-button ${testType === "softskills" ? 'finish-button' : ''}`} 
                onClick={handleNext} 
                disabled={isSubmitting}
            >
              {isSubmitting ? t('testPage.status.saving') : t('testPage.buttons.next')}
            </button>
          ) : (
            <button 
                className="next-button finish-button" 
                onClick={triggerEndModal} 
                disabled={isSubmitting}
            >
              {isSubmitting ? t('testPage.status.processing') : t('testPage.buttons.finish')}
            </button>
          )}
        </div>
      </div>

      <ConfirmTestEndModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmFinishTest} 
        unansweredCount={unansweredCount}
        unansweredLabels={unansweredLabels}
      />
      
      <StartTestErrorModal
        isOpen={isStartTestErrorModalOpen}
        onClose={handleCloseErrorModal}
        errorMessage={startErrorMessage}
      />
    </div>
  );
};

export default TestPage;