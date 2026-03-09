import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import './TestCreationMainPreview.css';
import ConfirmDeleteQuestionModal from "../../modal_windows/ConfirmDeleteQuestionModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'; 

const TestCreationMainPreview = ({ questions = [], onDeleteQuestion, onEditQuestion, showError }) => {
  const { t } = useTranslation();
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
      <div className="preview-comment-block">
        <small className="preview-comment-hint">{t('testCreationPreview.hint')}:</small>
        <p className="preview-comment-text">{q.comment}</p>
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
            <textarea rows="4" placeholder={t('testCreationPreview.yourAnswerPlaceholder')} disabled className="preview-textarea" />
            <div className="preview-text-answer-correct">
              <small>{t('testCreationPreview.correctAnswer')}: <strong>{q.textAnswer?.correctText}</strong></small>
            </div>
            {commentBlock}
          </>
        );
      case "CODE":
        return (
          <div className="code-block">
            <div className="preview-code-block">
              <div className="preview-code-lang">{t('testCreationPreview.language')}: {q.codeAnswer?.language}</div>
              <pre className="preview-code-pre">{q.codeAnswer?.templateCode || "// Код"}</pre>
            </div>
            {commentBlock}
          </div>
        );
      default:
        return <div className="preview-unknown-type">{t('testCreationPreview.unknownType')}</div>;
    }
  };

  if (!questions.length) {
    return (
      <div className="testCreationMainPreview">
        <div className='container'>
          <div className="test-container">
            <h2 className={`question preview-no-questions ${showError ? 'error' : ''}`}>
              {t('testCreationPreview.noQuestions')}
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
            <span className="preview-question-number">#{safeIndex + 1}</span>
            {q.questionText} 
          </h2>
          
          <div className="answer">{renderQuestion(q)}</div>

          <div className="test-buttons">
            
            <div className="testcard-buttons">
                <button
                  className="testcard-action-btn btn-edit"
                  onClick={() => onEditQuestion(safeIndex)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <span>{t('testCreationPreview.edit')}</span>
                </button>

                <button
                  className="testcard-action-btn btn-delete"
                  onClick={() => setIsModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                  <span>{t('testCreationPreview.delete')}</span>
                </button>
            </div>

            <button
              className="next-button"
              disabled={safeIndex >= questions.length - 1}
              onClick={() => setCurrent(prev => prev + 1)}
            >
              {t('testCreationPreview.nextQuestion')}
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