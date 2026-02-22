import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";

// Імпорти для підсвічування синтаксису
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-csharp";
import "prismjs/themes/prism.css"; 

import ConfirmTestEndModal from "../modal_windows/ConfirmTestEndModal";
import GeneralTestInfoHeader from '../../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import TestReviewGrading from '../../components/TestReviewGrading/TestReviewGrading';
import TestReviewQuestions from '../../components/TestReviewQuestions/TestReviewQuestions';

const getMockAttemptData = (t) => ({
  testName: t('trialTest.testName'),
  isFixedTime: true,
  endTime: new Date(new Date().getTime() + 15 * 60000).toISOString(), 
  questions: [
    {
      questionId: "q1",
      questionType: "SINGLE_CHOICE",
      questionText: t('trialTest.questions.q1.text'),
      choiceOptions: [
        { optionId: "o1", optionText: t('trialTest.questions.q1.options.o1') },
        { optionId: "o2", optionText: t('trialTest.questions.q1.options.o2') }, 
        { optionId: "o3", optionText: t('trialTest.questions.q1.options.o3') }
      ],
      correctAnswer: "o2" 
    },
    {
      questionId: "q2",
      questionType: "MULTIPLE_CHOICE",
      questionText: t('trialTest.questions.q2.text'),
      choiceOptions: [
        { optionId: "o4", optionText: t('trialTest.questions.q2.options.o4') }, 
        { optionId: "o5", optionText: t('trialTest.questions.q2.options.o5') },
        { optionId: "o6", optionText: t('trialTest.questions.q2.options.o6') },    
        { optionId: "o7", optionText: t('trialTest.questions.q2.options.o7') }
      ],
      correctAnswers: ["o4", "o6"] 
    },
    {
      questionId: "q3",
      questionType: "TEXT",
      questionText: t('trialTest.questions.q3.text'),
      correctAnswerText: t('trialTest.questions.q3.correctAnswer')
    },
    {
      questionId: "q4",
      questionType: "CODE",
      questionText: t('trialTest.questions.q4.text'),
      codeLanguage: "javascript",
      templateCode: t('trialTest.questions.q4.template')
    }
  ]
});

const TrialTest = ({ testType }) => { 
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0); 
  const [answers, setAnswers] = useState({}); 
  const [outputMap, setOutputMap] = useState({}); 
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [resultData, setResultData] = useState(null);

  const mockAttemptData = getMockAttemptData(t);  

  useEffect(() => {
    if (timeLeft <= 0 && !isFinished) {
        finishTrialTest(); 
        return;
    }
    if (isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (sec) => {
    if (sec < 0) sec = 0;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return { h, m, s };
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (current < mockAttemptData.questions.length - 1) {
        setCurrent(prev => prev + 1);
    }
  };

  const handleJumpToQuestion = (index) => {
      setCurrent(index);
  };

  const handleRunCode = (question) => {
    const code = answers[question.questionId];
    if (!code) return;

    setOutputMap(prev => ({ ...prev, [question.questionId]: t('testPage.compiling') || "Компіляція..." }));
    
    setTimeout(() => {
        let outputText = t('trialTest.simulation.init');
        if (code.includes("a + b") || code.includes("return")) {
            outputText += t('trialTest.simulation.pass');
        } else {
            outputText += t('trialTest.simulation.fail');
        }
        setOutputMap(prev => ({ ...prev, [question.questionId]: outputText }));
    }, 1500);
  };

  const handleFinishButton = () => {
    setIsConfirmModalOpen(true);
  };

  const finishTrialTest = () => {
      setIsConfirmModalOpen(false);
      
      let totalScore = 0;
      const totalMaxScore = mockAttemptData.questions.length;

      const gradedQuestions = mockAttemptData.questions.map(q => {
          let isCorrect = false;
          let userAnswer = answers[q.questionId];
          
          let selectedOptionIds = [];
          let correctOptionIds = [];

          if (q.questionType === "SINGLE_CHOICE") {
              isCorrect = userAnswer === q.correctAnswer;
              selectedOptionIds = userAnswer ? [userAnswer] : [];
              correctOptionIds = [q.correctAnswer];
          } else if (q.questionType === "MULTIPLE_CHOICE") {
              const userArr = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
              const correctArr = Array.isArray(q.correctAnswers) ? [...q.correctAnswers].sort() : [];
              isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr);
              selectedOptionIds = userArr;
              correctOptionIds = correctArr;
          } else if (q.questionType === "TEXT") {
              const normalizedUser = (userAnswer || "").trim().toLowerCase();
              isCorrect = normalizedUser === (q.correctAnswerText || "").toLowerCase();
          } else if (q.questionType === "CODE") {
              const codeAns = (userAnswer || "").toLowerCase();
              isCorrect = codeAns.includes("a + b") || codeAns.includes("return");
          }

          if (isCorrect) totalScore += 1;

          const optionsList = (q.choiceOptions || q.options || []).map(opt => ({
              ...opt,
              id: opt.optionId || opt.id,       
              text: opt.optionText || opt.text  
          }));

          let finalCorrectAnswers = [];
          if (q.questionType === "SINGLE_CHOICE") finalCorrectAnswers = [q.correctAnswer];
          if (q.questionType === "MULTIPLE_CHOICE") finalCorrectAnswers = q.correctAnswers;

          return {
              questionId: q.questionId,
              type: q.questionType, 
              questionText: q.questionText,
              
              options: optionsList,
              selectedOptionIds: selectedOptionIds,
              correctOptionIds: correctOptionIds,
              
              userAnswer: userAnswer || "",
              correctAnswer: q.correctAnswerText,
              
              language: q.codeLanguage,
              userCode: userAnswer || "",
              testCases: isCorrect ? t('trialTest.results.passed') : t('trialTest.results.failed'),
              
              isCorrect: isCorrect,
              weight: 1.0,
              comment: isCorrect ? t('trialTest.results.commentSuccess') : t('trialTest.results.commentFail')
          };
      });

      setResultData({
          testName: mockAttemptData.testName,
          score: totalScore,
          totalMaxScore: totalMaxScore,
          questions: gradedQuestions
      });

      setIsFinished(true); 
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
    const optionsList = q.choiceOptions || [];

    switch (q.questionType) {
      case "SINGLE_CHOICE":
        return (
          <div className="choices">
            {optionsList.map((opt) => (
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
            {optionsList.map((opt) => (
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
            placeholder={t('testPage.placeholder') || "Введіть вашу відповідь..."}
            style={{width: '100%', padding: '10px', marginTop: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
          />
        );

      case "CODE":
        return (
          <div style={{ marginTop: '10px' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
              <span style={{fontWeight: 'bold', color: '#555'}}>Мова: {q.codeLanguage || "text"}</span>
              <button className="run-button" onClick={() => handleRunCode(q)} disabled={!answer}>
                {t('testPage.runCode') || "Запустити код"}
              </button>
            </div>
            
            <div className="code-editor-wrapper" style={{ border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden' }}>
                <Editor
                    value={answer || q.templateCode || ""}
                    onValueChange={(code) => handleAnswerChange(q.questionId, code)}
                    highlight={(code) => highlightCode(code, q.codeLanguage || 'javascript')}
                    padding={15}
                    style={{ fontFamily: '"Fira code", "Fira Mono", monospace', fontSize: 14, backgroundColor: '#f5f5f5', minHeight: '200px' }}
                />
            </div>
            {outputMap[q.questionId] && (
              <div className="code-output" style={{marginTop: '15px', padding: '10px', background: '#222', color: '#fff', borderRadius: '5px', fontFamily: 'monospace', whiteSpace: 'pre-wrap'}}>
                {outputMap[q.questionId]}
              </div>
            )}
          </div>
        );
      default: return <p>Невідомий тип питання</p>;
    }
  };

  if (isFinished && resultData) {
      return (
          <div className="page" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
              <GeneralTestInfoHeader
                  title={resultData.testName}
                  name={resultData.candidateName}
              />

              <TestReviewGrading 
                  score={resultData.score} 
                  totalMaxScore={resultData.totalMaxScore} 
                  isPending={false} 
              />

              <TestReviewQuestions 
                  questionsLink={resultData.questions} 
                  isGradingMode={false} 
                  onGrade={() => {}} 
              />
          </div>
      );
  }

  const currentQuestion = mockAttemptData.questions[current];
  const { h, m, s } = formatTime(timeLeft);

  return (
    <div className={`FullTest ${testType === "softskills" ? 'FullTest-gradient' : 'FullTest-regular'}`} style={{userSelect: 'none'}}>
      
      {testType !== "softskills" &&
        <div className="header-bar">
            <div className="top-section">
              <h1 className="fulltest-title">{mockAttemptData.testName}</h1>
            </div>
          
          <div className="timer-box">
            <div className="time">
                <span className="time-val">{h}</span>
                <span className="time-label">{t('testPage.timer.hours') || "год"}</span>
            </div>
            <div className="time">
                <span className="time-val">{m}</span>
                <span className="time-label">{t('testPage.timer.minutes') || "хв"}</span>
            </div>
            <div className="time">
                <span className="time-val">{s}</span>
                <span className="time-label">{t('testPage.timer.seconds') || "сек"}</span>
            </div>
          </div>
        </div>
      }

      <div className={`Num ${testType === "softskills" ? 'Num-bg' : 'Num-regular'}`}>
        {mockAttemptData.questions.map((_, i) => (
          <button key={i} onClick={() => handleJumpToQuestion(i)} className={i === current ? "active" : ""}>
            {i + 1}
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
          {current < mockAttemptData.questions.length - 1 ? (
            <button className={`next-button ${testType === "softskills" ? 'finish-button' : ''}`} onClick={handleNext}>
              {t('testPage.buttons.next') || "Наступне"}
            </button>
          ) : (
            <button className="next-button finish-button" onClick={handleFinishButton}>
              {t('testPage.buttons.finish') || "Завершити"}
            </button>
          )}
        </div>
      </div>

      <ConfirmTestEndModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={finishTrialTest} 
        unansweredCount={0}
        unansweredLabels={""}
      />
    </div>
  );
};

export default TrialTest;