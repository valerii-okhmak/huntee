import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import './TestReviewQuestions.css';
import { useNavigate } from "react-router-dom";

const QuestionItem = ({ q, index, isGradingMode, onGrade }) => {
    const { t } = useTranslation();
    const [points, setPoints] = useState("");
    const [comment, setComment] = useState("");

    const handleSave = () => {
        if (points === "") return;
        onGrade(q.questionId, parseFloat(points), comment);
    };

    const renderQuestionContent = () => {
        const commentBlock = q.comment ? (
            <div className="preview-comment" style={{ marginTop: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '5px', borderLeft: '4px solid #007bff' }}>
                <small style={{ fontWeight: 'bold', color: '#555' }}>{t('testReviewQuestions.hint')}:</small>
                <p style={{ margin: 0, fontSize: '14px' }}>{q.comment}</p>
            </div>
        ) : null;

        switch (q.type) {
            case "SINGLE_CHOICE":
            case "MULTIPLE_CHOICE": {
                const inputType = q.type === "SINGLE_CHOICE" ? 'radio' : 'checkbox';
                const correctMarkerClass = q.type === "SINGLE_CHOICE" ? "radio-circle-green " : "checkbox-square-green";
                const incorrectMarkerClass = q.type === "SINGLE_CHOICE" ? "radio-circle-red" : "checkbox-square-red";

                return (
                    <>
                        <div className="choices">
                            {(q.options || []).map((opt, i) => {
                                const isSelected = q.selectedOptionIds?.includes(opt.optionId);
                                const isCorrectAnswer = q.correctOptionIds?.includes(opt.optionId);
                                let markerClassToUse = q.type === "SINGLE_CHOICE" ? "radio-circle-blue " : "checkbox-square-blue ";

                                if (isSelected && isCorrectAnswer) markerClassToUse += correctMarkerClass;
                                else if (isSelected && !isCorrectAnswer) markerClassToUse += incorrectMarkerClass;

                                return (
                                    <label className={q.type === "SINGLE_CHOICE" ? "custom-radio" : "custom-checkbox"} key={i}>
                                        <input className="choices-input" type={inputType} disabled checked={isSelected} />
                                        <span className={markerClassToUse} />
                                        {opt.optionText}
                                    </label>
                                );
                            })}
                        </div>
                        {commentBlock}
                    </>
                );
            }
            case "TEXT":
                const isRated = q.isCorrect !== null && q.isCorrect !== undefined;
                return (
                    <>
                        <textarea
                            rows="4"
                            value={q.userAnswer || ""}
                            disabled
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
                        />
                        <div style={{ marginTop: '10px' }}>
                            <p><strong>{t('testReviewQuestions.correctAnswer')}:</strong> {q.correctAnswer}</p>
                            
                            {isRated && (
                                <small style={{ color: q.isCorrect ? '#28a745' : '#C32C2C', fontWeight: 'bold' }}>
                                    {q.isCorrect ? t('testReviewQuestions.graded') : t('testReviewQuestions.notGraded')}
                                </small>
                            )}
                        </div>
                        {commentBlock}
                    </>
                );
            case "CODE":
                return (
                    <>
                         <div className="code-preview" style={{ background: '#ffffff', border: '1px solid #ccc', padding: '15px', borderRadius: '5px', fontFamily: 'monospace' }}>
                            <div style={{ marginBottom: '10px', color: '#007bff', fontWeight: 'bold' }}>{t('testReviewQuestions.language')}: {q.language}</div>
                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '14px' }}>{q.userCode || "// " + t('testReviewQuestions.codeMissing')}</pre>
                            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '12px', color: '#666' }}>
                                <strong>{t('testReviewQuestions.testCases')}:</strong> {q.testCases}
                            </div>
                        </div>
                        {commentBlock}
                    </>
                );
            default: return null;
        }
    };

    return (
        <div className="test-container testReviewQuestionsTests">
            <h2 className="question">
                <span style={{ color: '#888', marginRight: '10px' }}>#{index + 1}</span>
                {q.questionText}
            </h2>
            <div className="answer">{renderQuestionContent()}</div>

            {isGradingMode && q.type === 'TEXT' && (
                <div className="manual-grading-panel" style={{ marginTop: '20px', padding: '15px', background: '#eef2f3', borderRadius: '8px', border: '1px solid #d1d1d1' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{t('testReviewQuestions.manualGrading')}</h4>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <input 
                            type="number" 
                            placeholder={t('testReviewQuestions.points')} 
                            value={points}
                            max={q.weight || 1.0} 
                            onChange={e => setPoints(e.target.value)}
                            style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <input 
                            type="text" 
                            placeholder={t('testReviewQuestions.commentStudent')} 
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <button 
                            onClick={handleSave}
                            style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            {t('testReviewQuestions.save')}
                        </button>
                    </div>
                    {q.isCorrect !== null && (
                         <div style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
                            <em>{t('testReviewQuestions.currentStatus')}: {q.isCorrect ? t('testReviewQuestions.graded') : "0 " + t('testReviewQuestions.pointsLabel')}</em>
                         </div>
                    )}
                </div>
            )}
        </div>
    );
};

const TestReviewQuestions = ({ questionsLink = [], isGradingMode, onGrade }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="testCreationMainPreview">
            <div className="container testReviewQuestionsContainer">
                {questionsLink && questionsLink.length > 0 ? (
                    questionsLink.map((q, index) => (
                        <QuestionItem 
                            key={index} 
                            q={q} 
                            index={index} 
                            isGradingMode={isGradingMode}
                            onGrade={onGrade}
                        />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: '#777', padding: '20px' }}>
                        {t('testReviewQuestions.loading')}
                    </div>
                )}

                {!isGradingMode && (
                    <div className="testDashboard__analytics-actions">
                        <button className="testDashboard__analytics-btn-dark" onClick={() => navigate('/')}>
                            {t('testReviewQuestions.finishReview')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestReviewQuestions;