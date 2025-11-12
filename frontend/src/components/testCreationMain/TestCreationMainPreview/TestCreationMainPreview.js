import React, { useState, useEffect } from "react";
import './TestCreationMainPreview.css'
import tryTestQuestions from "../../../data/questions.json";

const TestCreationMainPreview = ({}) => {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        setQuestions(tryTestQuestions);
    }, []);

    const renderQuestion = (q) => {
      
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
                />
              );
            case "code":
              return (
                <>
                  <div className="code-run-button-container">
                    <button
                      className="run-button"
                    >
                      Run
                    </button>
                  </div>
    
                  <textarea
                    rows="10"
                    placeholder={q.placeholder || ""}
                  />
    
                  <p className="note">Очікуваний вивід: {q.expectedOutput?.trim()}</p>
    
                </>
              );
            default:
              return null;
          }
        })();
      
        // if (q.image) {
        //   return (
        //     <div className="question-with-image">
        //       <img src={q.image} alt="зображення до питання" className="question-image" />
        //       <div className="question-content">{content}</div>
        //     </div>
        //   );
        // }
      
        return content;
    };

  return (
    <div className="testCreationMainPreview">
        <div className='container'>
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
                    <button disabled
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
    </div>
  )
}

export default TestCreationMainPreview