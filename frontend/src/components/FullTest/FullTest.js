import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FullTest.css";
import logo from "../../img/softserve.png";
import rawQuestions from "../../data/questions.json";



const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions";
const RAPIDAPI_HEADERS = {
  "content-type": "application/json",
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": "41a9f024efmsh1a0ad3ef3f1f9b0p162680jsnad4442fec743", 
};

const TestPage = ({testType, textData, time, questionsLink}) => {
  const [outputMap, setOutputMap] = useState({});
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(time); 

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setQuestions(questionsLink);
  }, []);

  // Таймер
  useEffect(() => {
    if (submitted) return;
    if (timeLeft == 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); 
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

      if ((q.type === "choice" || q.type === "text") && ans != null) {
        if (ans === q.correctAnswer) total++;
      }

      if (q.type === "code" && ans?.trim()) {
        try {
          // Об'єднуємо код користувача і runTemplate
          const fullCode = `${ans}\n${q.runTemplate}`;

          const response = await axios.post(
            `${JUDGE0_API}?base64_encoded=false&wait=true`,
            {
              source_code: fullCode,
              language_id: q.language_id,
              stdin: q.stdin || "",
            },
            { headers: RAPIDAPI_HEADERS }
          );

          const { stdout, stderr, compile_output, status } = response.data;

          const cleanOutput = (stdout || "").trim();
          const expected = q.expectedOutput.trim();

          if (
            status?.description === "Accepted" &&
            cleanOutput === expected
          ) {
            total++;
          } else {
            console.warn("Код не пройшов перевірку:", {
              question: q.id,
              output: cleanOutput,
              expected,
              stderr,
              compile_output,
              status,
            });
          }
        } catch (err) {
          console.error("Помилка під час перевірки коду:", err);
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
              onInput={(e) => {
                e.target.style.height = 'auto'; 
                e.target.style.height = `${e.target.scrollHeight}px`; 
              }}
            />
          );
        case "code":
          return (
            <>
              <div className="code-run-button-container">
                <button
                  className="run-button"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const fullCode = `${answer}\n${q.runTemplate || ""}`;
                      const submission = await axios.post(
                        JUDGE0_API + "?base64_encoded=false&wait=true",
                        {
                          source_code: fullCode,
                          language_id: q.language_id,
                          stdin: "",
                        },
                        { headers: RAPIDAPI_HEADERS }
                      );

                      const result =
                        submission.data.stdout?.trim() ||
                        submission.data.stderr?.trim() ||
                        submission.data.compile_output?.trim() ||
                        "Немає виводу";

                      setOutputMap((prev) => ({
                        ...prev,
                        [q.id]: result,
                      }));
                    } catch (e) {
                      setOutputMap((prev) => ({
                        ...prev,
                        [q.id]: "Помилка під час виконання коду",
                      }));
                      console.error("Run code error:", e);
                    }
                    setLoading(false);
                  }}
                >
                  Run
                </button>
              </div>

              <textarea
                rows="10"
                value={answer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={q.placeholder || ""}
              />

              <p className="note">Очікуваний вивід: {q.expectedOutput?.trim()}</p>

              {outputMap[q.id] && (
                <div className="code-output">
                  <strong>Результат виконання:</strong>
                  <pre>{outputMap[q.id]}</pre>
                </div>
              )}
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
    <div className={`FullTest ${testType === "softskills" ? 'FullTest-gradient' : 'FullTest-regular'}`}>
      {testType != "softskills" &&
        <div className="header-bar">
            <div className="top-section">
              <div className="top-line">
                <div className="category">{textData.category}</div>
                <div className="logo">
                  <img src={textData.logo} alt="Фото компанії" />
                </div>
              </div>
              <h1 className="fulltest-title">{textData.title}</h1>
              <div className="top-line">
                <div className="location">
                  <div className="icon">
                    <img src="/icons/location.png" alt="Локація" />
                  </div>
                  {textData.location}
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
      }

      <div className={`test-container ${testType === "softskills" ? 'test-container-transparent' : ''}`}>
        {questions.length > 0 && (
          <>
            <h2 className="question">{questions[current].question}</h2>
            <div className="answer">{renderQuestion(questions[current])}</div>
          </>
        )}

        <div className="test-buttons">
          {current < questions.length - 1 && (
            <button
              className={`next-button ${testType === "softskills" ? 'finish-button' : ''}`}
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

      <div className={`Num ${testType === "softskills" ? 'Num-bg' : ''}`}>
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
