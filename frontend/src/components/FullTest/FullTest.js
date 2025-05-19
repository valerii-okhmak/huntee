import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FullTest.css";
import logo from "../../img/softserve.png";

const questions = [
  {
    id: 1,
    type: "choice",
    question: "Яка столиця Франції?",
    options: ["Берлін", "Париж", "Рим", "Мадрид"],
    correctAnswer: "Париж",
  },
  {
    id: 2,
    type: "text",
    question: "Хто написав «Кобзар»?",
    correctAnswer: "Тарас Шевченко",
  },
  {
    id: 3,
    type: "code",
    question:
      "Напиши функцію, яка повертає суму двох чисел (a, b). Виведи результат функції з аргументами (2, 3).",
    language_id: 71, // Python
    expectedOutput: "5\n",
  },
];

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions";
const RAPIDAPI_HEADERS = {
  "content-type": "application/json",
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY", // заміни на свій
};

const TestPage = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 година у секундах

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
          ans &&
          ans.toString().trim().toLowerCase() ===
            q.correctAnswer.toString().trim().toLowerCase()
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
    const answer = answers[q.id] || "";

    switch (q.type) {
      case "choice":
        return (
          <div className="choices">
            {q.options.map((opt, i) => (
              <label key={i}>
                <input
                  type="radio"
                  value={opt}
                  checked={answer === opt}
                  onChange={() => handleAnswerChange(opt)}
                />
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
          <h1 className="title">JUNIOR DATA SCIENTIST</h1>
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
        <h2>Питання {current + 1} з {questions.length}</h2>
        <p className="question">{questions[current].question}</p>
        <div className="answer">{renderQuestion(questions[current])}</div>

        <button
          className="next-button"
          onClick={() =>
            setCurrent((prev) => Math.min(prev + 1, questions.length - 1))
          }
        >
          Наступне питання
        </button>

        <button onClick={handleSubmit} disabled={loading || submitted}>
          Завершити тест
        </button>

        {loading && <p>Перевірка відповідей...</p>}
        {submitted && !loading && (
          <p className="result">
            Результат: {score} / {questions.length}
          </p>
        )}
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
