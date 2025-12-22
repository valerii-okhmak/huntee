import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../../utils/auth";
import "./FullTest.css";
import ConfirmTestEndModal from '../modal_windows/ConfirmTestEndModal';
import StartTestErrorModal from '../modal_windows/StartTestErrorModal';


const TestPage = ({ testType }) => { 
  const { testId } = useParams(); 
  const navigate = useNavigate();

  const [attemptData, setAttemptData] = useState(null); 
  const [current, setCurrent] = useState(0); 
  const [answers, setAnswers] = useState({}); 
  const [codeOutput, setCodeOutput] = useState({}); 

  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [attemptIdForReview, setAttemptIdForReview] = useState(null);

  const [unansweredCount, setUnansweredCount] = useState(0);
  const [unansweredLabels, setUnansweredLabels] = useState("");

  const [isStartTestErrorModalOpen, setIsStartTestErrorModalOpen] = useState(false);
  const [startErrorMessage, setStartErrorMessage] = useState("");

  const handleCloseErrorModal = () => {
    setIsStartTestErrorModalOpen(false);
    navigate(-1);
  };

  useEffect(() => {
    const startTest = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND}/api/tests/${testId}/start`,
          {}, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        const attempt = response.data;
        setAttemptData(attempt);

        // Ініціалізуємо таймер тільки якщо час фіксований
        if (attempt.isFixedTime && attempt.endTime) {
          const endTime = new Date(attempt.endTime).getTime();
          const now = new Date().getTime();
          setTimeLeft(Math.floor((endTime - now) / 1000));
        } else {
          setTimeLeft(null); 
        }
        setLoading(false);
      } catch (error) {
        console.error("Помилка старту тесту:", error);
        const msg = error.response?.data?.message || "Не вдалося розпочати тест.";
        setStartErrorMessage(msg);
        setIsStartTestErrorModalOpen(true);
        setLoading(false);
      }
    };

    if (testId) startTest();
  }, [testId]);

  useEffect(() => {
    // Якщо таймер не встановлений (null) або час вийшов
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
        handleFinishTest(); 
        return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec) => {
    if (sec < 0) sec = 0;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return { h, m, s };
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const saveCurrentAnswer = async () => {
    if (!attemptData) return;
    
    const question = attemptData.questions[current];
    const currentAnswer = answers[question.questionId];

    if (currentAnswer === undefined || currentAnswer === null || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
        return; 
    }

    try {
      const token = getAccessToken();
      
      let body = { questionType: question.questionType };

      if (question.questionType === 'SINGLE_CHOICE') {
         body.selectedOptionIds = [currentAnswer]; 
      } else if (question.questionType === 'MULTIPLE_CHOICE') {
         body.selectedOptionIds = currentAnswer;
      } else if (question.questionType === 'TEXT' || question.questionType === 'CODE') {
         body.givenText = currentAnswer;
      }

      await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/attempts/${attemptData.attemptId}/questions/${question.questionId}/answer`,
        body,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Помилка збереження відповіді:", error);
    }
  };

  const handleRunCode = async (question) => {
    const code = answers[question.questionId];
    if (!code) return;

    try {
        setOutputMap(prev => ({ ...prev, [question.questionId]: "Compiling..." }));
        const token = getAccessToken();
        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND}/api/attempts/${attemptData.attemptId}/questions/${question.questionId}/run`,
            code, 
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'text/plain' } }
        );

        const result = response.data; 
        let outputText = result.allPassed ? "✅ All tests passed!\n" : "❌ Some tests failed.\n";
        result.results.forEach((res, idx) => {
            outputText += `\nTest Case #${idx + 1}:\nInput: ${res.input}\nExpected: ${res.expectedOutput}\nActual: ${res.actualOutput}\n${res.passed ? "Result: PASS" : "Result: FAIL"}\n`;
        });
        setOutputMap(prev => ({ ...prev, [question.questionId]: outputText }));
    } catch (error) {
        setOutputMap(prev => ({ ...prev, [question.questionId]: "Error running code." }));
    }
  };

  const [outputMap, setOutputMap] = useState({});

  const handleNext = async () => {
    setIsSubmitting(true);
    await saveCurrentAnswer(); 
    if (current < attemptData.questions.length - 1) {
      setCurrent(prev => prev + 1);
    }
    setIsSubmitting(false);
  };

  const getUnansweredDetails = () => {
    if (!attemptData) return { count: 0, labels: "" };
    const indices = attemptData.questions
      .map((q, index) => {
        const ans = answers[q.questionId];
        const isEmpty = (ans === undefined || ans === null || ans === "" || (Array.isArray(ans) && ans.length === 0));
        return isEmpty ? index + 1 : null;
      })
      .filter(num => num !== null);

    return {
      count: indices.length,
      labels: indices.length > 0 ? ` (${indices.join(", ")})` : ""
    };
  };

  const handleFinishTest = async () => {
    setIsSubmitting(true);
    await saveCurrentAnswer(); 

    const details = getUnansweredDetails();
    setUnansweredCount(details.count);
    setUnansweredLabels(details.labels);

    try {
        const token = getAccessToken();
        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND}/api/attempts/${attemptData.attemptId}/finish`,
            {},
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        setFinalScore(response.data.score);
        setAttemptIdForReview(response.data.attemptId);
        setIsConfirmModalOpen(true); 

    } catch (error) {
        console.error("Помилка завершення:", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderQuestion = (q) => {
    const commentBlock = q.comment ? (
      <div className="preview-comment" style={{marginTop: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '5px', borderLeft: '4px solid #007bff'}}>
          <small style={{fontWeight: 'bold', color: '#555'}}>Підказка:</small>
          <p style={{margin: 0, fontSize: '14px'}}>{q.comment}</p>
      </div>
    ) : null;

    const answer = answers[q.questionId];

    switch (q.questionType) {
      case "SINGLE_CHOICE":
        return (
          <>
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
          {commentBlock}
          </>
        );
      case "MULTIPLE_CHOICE":
        const selectedIds = Array.isArray(answer) ? answer : [];
        return (
          <>
          <div className="choices">
            {q.choiceOptions.map((opt) => (
              <label className="custom-checkbox" key={opt.optionId}>
                <input
                  className="choices-input"
                  type="checkbox"
                  value={opt.optionId}
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
          {commentBlock}
          </>
        );
      case "TEXT":
        return (
          <>
          <textarea
            rows="6"
            value={answer || ""}
            onChange={(e) => handleAnswerChange(q.questionId, e.target.value)}
            placeholder="Введіть вашу відповідь..."
          />
          {commentBlock}
          </>
        );
      case "CODE":
        return (
          <>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
              <span style={{fontWeight: 'bold', color: '#555'}}>Мова: {q.codeLanguage}</span>
              <button className="run-button" onClick={() => handleRunCode(q)} disabled={!answer}>Run Code</button>
            </div>
            <textarea
              rows="12"
              style={{fontFamily: 'monospace', backgroundColor: '#f5f5f5', border: '1px solid #ccc'}}
              value={answer || q.templateCode || ""}
              onChange={(e) => handleAnswerChange(q.questionId, e.target.value)}
            />
            {outputMap[q.questionId] && (
              <div className="code-output" style={{marginTop: '15px', padding: '10px', background: '#222', color: '#fff', borderRadius: '5px', fontFamily: 'monospace', whiteSpace: 'pre-wrap'}}>
                {outputMap[q.questionId]}
              </div>
            )}
            {commentBlock}
          </>
        );
      default:
        return <p>Невідомий тип питання</p>;
    }
  };

  if (loading) return <div className="page"><div className="container">Завантаження тесту...</div></div>;
  if (!attemptData) {
    return (
      <StartTestErrorModal
        isOpen={isStartTestErrorModalOpen}
        onClose={handleCloseErrorModal}
        errorMessage={startErrorMessage}
      />
    );
  }

  const { h, m, s } = timeLeft !== null ? formatTime(timeLeft) : { h:0, m:0, s:0 };
  const currentQuestion = attemptData.questions[current];

  return (
    <div className={`FullTest ${testType === "softskills" ? 'FullTest-gradient' : 'FullTest-regular'}`}>
      {testType !== "softskills" &&
        <div className="header-bar">
            <div className="top-section">
              <div className="top-line"><div className="category">{attemptData.sphere}</div></div>
              <h1 className="fulltest-title">{attemptData.testName}</h1>
              <div className="top-line"></div>
            </div>
          
          {/* Умовний рендеринг таймера на основі isFixedTime */}
          {attemptData.isFixedTime && (
            <div className="timer-box">
              <div className="time"><span className="time-val">{h}</span><span className="time-label">годин</span></div>
              <div className="time"><span className="time-val">{m}</span><span className="time-label">хвилин</span></div>
              <div className="time"><span className="time-val">{s}</span><span className="time-label">секунд</span></div>
            </div>
          )}
        </div>
      }

      <div className={`Num ${testType === "softskills" ? 'Num-bg' : 'Num-regular'}`}>
        {attemptData.questions.map((_, i) => (
          <button
            key={i}
            onClick={async () => { await saveCurrentAnswer(); setCurrent(i); }}
            className={i === current ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className={`test-container ${testType === "softskills" ? 'test-container-transparent' : ''}`}>
        <h2 className="question">{currentQuestion.questionText}</h2>
        <div className="answer">{renderQuestion(currentQuestion)}</div>
        <div className="test-buttons">
          {current < attemptData.questions.length - 1 ? (
            <button className={`next-button ${testType === "softskills" ? 'finish-button' : ''}`} onClick={handleNext} disabled={isSubmitting}>
              Наступне питання
            </button>
          ) : (
            <button className="next-button finish-button" onClick={handleFinishTest} disabled={isSubmitting}>
              Завершити тест
            </button>
          )}
        </div>
      </div>

      <ConfirmTestEndModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        score={finalScore}
        onViewResults={() => navigate(`/testreview/${attemptIdForReview}`)}
        unansweredCount={unansweredCount}
        unansweredLabels={unansweredLabels}
        text={"Чи ви впевнені, що хочете завершити спробу?"}
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