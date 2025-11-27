import React, { useState, useEffect } from "react";
import './TestCreationMainPreview.css'

const TestCreationMainPreview = ({ questions = [], onDeleteQuestion }) => {
  const [current, setCurrent] = useState(0);

  // Клэмп індекса при будь-якій зміні масиву питань
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

    // Якщо видаляємо останнє — спершу зсунемо локальний індекс вліво,
    // щоб не було короткого стану з поза-межним індексом.
    if (current === questions.length - 1) {
      setCurrent(prev => Math.max(0, prev - 1));
    }
    onDeleteQuestion(current);
  };

  // Якщо немає питань — нічого не читаємо з q
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

  // Додатковий захист у самому рендері
  const safeIndex = Math.min(Math.max(current, 0), questions.length - 1);
  const q = questions[safeIndex];

  const renderQuestion = (q) => {
    if (!q) return null;

    switch (q.type) {
      case "regular":
      case "multiple":
        return (
          <div className="choices">
            {(q.options || []).map((opt, i) => (
              <label className={q.type === 'regular' ? "custom-radio" : "custom-checkbox"} key={i}>
                <input
                  className="choices-input"
                  type={q.type === 'regular' ? 'radio' : 'checkbox'}
                  name={`q-${safeIndex}`}
                  disabled
                />
                <span className={q.type === 'regular' ? "radio-square" : "radio-square"} />
                {opt}
              </label>
            ))}
          </div>
        );

      case "open":
      case "practical":
        return (
          <>
            <textarea rows="6" placeholder="Ваша відповідь..." disabled />
            {q.commentEnabled && q.comment?.trim() && (
              <p className="note" style={{ marginTop: '8px' }}>
                <strong>Коментар:</strong> {q.comment}
              </p>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="testCreationMainPreview">
      <div className='container'>
        <div className="test-container">
          <h2 className="question">{q.question}</h2>
          <div className="answer">{renderQuestion(q)}</div>

          <div className="test-buttons" style={{ display: "flex", gap: "10px" }}>
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
