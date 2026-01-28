import React, { useState, useEffect } from "react";
import './TestCreationMainPreview.css';
import ConfirmDeleteQuestionModal from "../../modal_windows/ConfirmDeleteQuestionModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'; 

const TestCreationMainPreview = ({ questions = [], onDeleteQuestion, onEditQuestion, showError }) => {
  const [current, setCurrent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (questions.length === 0) {
      setCurrent(0);
    } else {
      setCurrent(prev => Math.min(Math.max(prev, 0), questions.length - 1));
    }
  }, [questions]);

  const handleConfirmDelete = () => {
    if (questions.length === 0) return;
    onDeleteQuestion(current);
    if (current === questions.length - 1 && current > 0) {
      setCurrent(prev => prev - 1);
    }
    setIsModalOpen(false);
  };

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
                  <input className="choices-input" type="radio" disabled checked={opt.isCorrect} />
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
                  <input className="choices-input" type="checkbox" disabled checked={opt.isCorrect} />
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
          <div className="code-block">
            <div className="code-preview" style={{background: '#ffffff', border: '1px solid #ccc', padding: '15px', borderRadius: '5px', fontFamily: 'monospace'}}>
              <div style={{marginBottom: '10px', color: '#007bff', fontWeight: 'bold'}}>Мова: {q.codeAnswer?.language}</div>
              <pre style={{whiteSpace: 'pre-wrap', margin: 0}}>{q.codeAnswer?.templateCode || "// Код"}</pre>
            </div>
            {commentBlock}
          </div>
        );
      default:
        return <div style={{color: 'red'}}>Невідомий тип питання</div>;
    }
  };

  if (!questions.length) {
    return (
      <div className="testCreationMainPreview">
        <div className='container'>
          <div className="test-container">
            <h2 className="question" style={{ color: showError ? '#dc3545' : 'inherit', transition: 'color 0.3s ease' }}>
              Немає питань для перегляду
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="testCreationMainPreview">
      <div className='container'>
        <div className="test-container">
          <h2 className="question">
            <span style={{color: '#888', marginRight: '10px'}}>#{safeIndex + 1}</span>
            {q.questionText} 
          </h2>
          
          <div className="answer">{renderQuestion(q)}</div>

          {/* БЛОК КНОПОК */}
          <div className="test-buttons" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: '25px', flexWrap: 'wrap', gap: '15px' }}>
            
            {/* Кнопка "Наступне питання" зліва */}
            <button
              className="next-button"
              disabled={safeIndex >= questions.length - 1}
              onClick={() => setCurrent(prev => prev + 1)}
            >
              Наступне питання
            </button>

            {/* Група кнопок Редагувати/Видалити справа */}
            <div className="testcard-buttons" style={{ width: 'auto', margin: 0 }}>
                <button
                  className="testcard-action-btn btn-edit"
                  onClick={() => onEditQuestion(safeIndex)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <span>Редагувати</span>
                </button>

                <button
                  className="testcard-action-btn btn-delete"
                  onClick={() => setIsModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                  <span>Видалити</span>
                </button>
            </div>

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

      <ConfirmDeleteQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        questionNumber={safeIndex + 1}
      />
    </div>
  );
};

export default TestCreationMainPreview;