import React, { useState, useEffect } from "react";
import './TestCreationMainPreview.css'

const TestCreationMainPreview = ({ questions = [], onDeleteQuestion }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (questions.length === 0) {
      setCurrent(0);
    } else {
      setCurrent(prev => Math.min(Math.max(prev, 0), questions.length - 1));
    }
  }, [questions]);

  const handleDelete = () => {
    if (questions.length === 0) return;
    const confirmDelete = window.confirm("Ви впевнені, що хочете видалити це запитання?");
    if (!confirmDelete) return;

    if (current === questions.length - 1) {
      setCurrent(prev => Math.max(0, prev - 1));
    }
    onDeleteQuestion(current);
  };

  if (!questions.length) {
    return (
      <div className="testCreationMainPreview">
        <div className='container'>
          <div className="test-container">
            <h2 className="question">Немає питань для перегляду</h2>
          </div>
        </div>
      </div>
    );
  }

  const safeIndex = Math.min(Math.max(current, 0), questions.length - 1);
  const q = questions[safeIndex];

  const renderQuestion = (q) => {
    if (!q) return null;

    const commentBlock = q.comment ? (
        <div className="preview-comment" style={{marginTop: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '5px', borderLeft: '4px solid #007bff'}}>
            <small style={{fontWeight: 'bold', color: '#555'}}>Підказка:</small>
            <p style={{margin: 0, fontSize: '14px'}}>{q.comment}</p>
        </div>
    ) : null;

    switch (q.questionType) {
    case "SINGLE_CHOICE":
      return (
        <>
          <div className="choices">
            {(q.choiceOptions || []).map((opt, i) => (
              <label className="custom-radio" key={i}>
                <input
                  className="choices-input"
                  type="radio"
                  name={`preview-q-${safeIndex}`}
                  disabled
                  checked={opt.isCorrect}
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
      return (
        <>
          <div className="choices">
            {(q.choiceOptions || []).map((opt, i) => (
              <label className="custom-checkbox" key={i}>
                <input
                  className="choices-input"
                  type="checkbox"
                  disabled
                  checked={opt.isCorrect} 
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
            <textarea rows="4" placeholder="Ваша відповідь..." disabled className="preview-textarea" />
            <div style={{marginTop: '10px', color: '#28a745'}}>
                <small>Правильна відповідь: <strong>{q.textAnswer?.correctText}</strong></small>
            </div>
            {commentBlock}
          </>
        );

      case "CODE":
        return (
          <>
            <div className="code-preview" style={{
                background: '#ffffff',
                color: '#333333',
                border: '1px solid #ccc',
                padding: '15px', 
                borderRadius: '5px', 
                fontFamily: 'monospace', 
                overflowX: 'auto'
            }}>
                <div style={{marginBottom: '10px', color: '#007bff', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
                    Мова: {q.codeAnswer?.language}
                </div>
                <pre style={{whiteSpace: 'pre-wrap', margin: 0, fontSize: '14px'}}>
                    {q.codeAnswer?.templateCode || "// Тут буде код студента"}
                </pre>
                
                <div style={{marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '12px', color: '#666'}}>
                    <strong>Тест-кейси:</strong> {q.codeAnswer?.testCases}
                </div>
            </div>
            {commentBlock}
          </>
        );

      default:
        return (
            <div style={{color: 'red'}}>
                Невідомий тип питання: {q.questionType}
            </div>
        );
    }
  };

  return (
    <div className="testCreationMainPreview">
      <div className='container'>
        <div className="test-container">
          <h2 className="question">
            <span style={{color: '#888', marginRight: '10px'}}>#{safeIndex + 1}</span>
            {q.questionText} 
          </h2>
          
          <div className="answer">{renderQuestion(q)}</div>

          <div className="test-buttons" style={{ display: "flex", gap: "10px", marginTop: '20px' }}>
            <button
              className="next-button"
              disabled={safeIndex >= questions.length - 1}
              onClick={() => setCurrent(prev => Math.min(prev + 1, questions.length - 1))}
            >
              Наступне питання
              <svg xmlns="http://www.w3.org/2000/svg" width="34" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 38 24" style={{ marginLeft: "8px", verticalAlign: "middle" }}>
                <line x1="4" y1="12" x2="34" y2="12" />
                <polyline points="26 6 34 12 26 18" />
              </svg>
            </button>

            <button
              className="delete-button"
              onClick={handleDelete}
              style={{
                backgroundColor: '#ff3b30',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Видалити запитання
            </button>
          </div>
        </div>

        <div className="Num">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={i === safeIndex ? "active" : ""}
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