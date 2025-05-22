import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FullTest.css";
import logo from "../../img/softserve.png";
import rawQuestions from "../../data/questions.json";



const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions";
const RAPIDAPI_HEADERS = {
  "content-type": "application/json",
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": "", // заміни на свій
};

const TestPage = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 година у секундах

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setQuestions(rawQuestions);
  }, []);

  // Таймер
  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // автозавершення
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  const handleAnswerChange = (value) => {
    setAnswers({ ...answers, [questions[current].id]: value });
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setLoading(true);
    let total = 0;

    for (const q of questions) {
      const ans = answers[q.id];
      if (q.type === "choice" || q.type === "text") {
        if (
          ans != null &&
          ans === q.correctAnswer
        ) {
          total++;
        }
      } else if (q.type === "code") {
        try {
          const submission = await axios.post(
            JUDGE0_API + "?base64_encoded=false&wait=true",
            {
              source_code: ans,
              language_id: q.language_id,
              stdin: "",
            },
            { headers: RAPIDAPI_HEADERS }
          );

          if (submission.data.stdout === q.expectedOutput) {
            total++;
          }
        } catch (e) {
          console.error("Помилка компіляції:", e);
        }
      }
    }

    setScore(total);
    setSubmitted(true);
    setLoading(false);
  };
  

  const renderQuestion = (q) => {
    const answer = answers[q.id];
  
    const content = (() => {
      switch (q.type) {
        case "choice":
          return (
            <div className="choices">
              {q.options.map((opt, i) => (
                <label className="custom-radio" key={i}>
                  <input
                    className="choices-input"
                    type="radio"
                    value={i}
                    checked={answer === i}
                    onChange={() => handleAnswerChange(i)}
                  />
                  <span className="radio-square" />
                  {opt}
                </label>
              ))}
            </div>
          );
        case "text":
          return (
            <textarea
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          );
        case "code":
          return (
            <>
              <textarea
                rows="10"
                value={answer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="def sum(a, b):\n    return a + b\n\nprint(sum(2, 3))"
              />
              <p className="note">Очікуваний вивід: {q.expectedOutput.trim()}</p>
            </>
          );
        default:
          return null;
      }
    })();
  
    if (q.image) {
      return (
        <div className="question-with-image">
          <img src={q.image} alt="зображення до питання" className="question-image" />
          <div className="question-content">{content}</div>
        </div>
      );
    }
  
    return content;
  };
  

  // Форматування часу
  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return { h, m, s };
  };

  const { h, m, s } = formatTime(timeLeft);

  return (
    <div className="FullTest">
      <div className="header-bar">
        <div className="top-section">
          <div className="top-line">
            <div className="category">Data Science</div>
            <div className="logo">
              <img src={logo} alt="Фото компанії" />
            </div>
          </div>
          <h1 className="fulltest-title">JUNIOR DATA SCIENTIST</h1>
          <div className="top-line">
            <div className="location">
              <div className="icon">
                <img src="/icons/location.png" alt="Локація" />
              </div>
              Lviv
            </div>
          </div>
        </div>

        <div className="timer-box">
          <div className="time">
            <span className="time-val">{h}</span>
            <span className="time-label">годин</span>
          </div>
          <div className="time">
            <span className="time-val">{m}</span>
            <span className="time-label">хвилин</span>
          </div>
          <div className="time">
            <span className="time-val">{s}</span>
            <span className="time-label">секунд</span>
          </div>
        </div>
      </div>

      <div className="test-container">
        {questions.length > 0 && (
          <>
            <h2 className="question">{questions[current].question}</h2>
            <div className="answer">{renderQuestion(questions[current])}</div>
          </>
        )}

        <div className="test-buttons">
          {current < questions.length - 1 && (
            <button
              className="next-button"
              onClick={() =>
                setCurrent((prev) => Math.min(prev + 1, questions.length - 1))
              }
            >
              Наступне питання
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 38 24"
                style={{ marginLeft: "8px", verticalAlign: "middle" }}
              >
              <line x1="4" y1="12" x2="34" y2="12" />
              <polyline points="26 6 34 12 26 18" />
              </svg>
            </button>
          )}

          {current === questions.length - 1 && (
            <button className="next-button finish-button" onClick={handleSubmit} disabled={loading || submitted}>
              Завершити тест
            </button>
          )}

          {loading && <p>Перевірка відповідей...</p>}
          {submitted && !loading && (
            <p className="result">
              Результат: {score} / {questions.length}
            </p>
          )}
        </div>
      </div>

      <div className="Num">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={i === current ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
