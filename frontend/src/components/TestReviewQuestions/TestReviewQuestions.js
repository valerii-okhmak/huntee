import React from "react";
import './TestReviewQuestions.css'

const TestReviewQuestions = ({ questionsLink = [] }) => {

    const renderQuestion = (q) => {
        if (!q) return null;

        const commentBlock = q.comment ? (
            <div className="preview-comment" style={{ marginTop: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '5px', borderLeft: '4px solid #007bff' }}>
                <small style={{ fontWeight: 'bold', color: '#555' }}>Підказка:</small>
                <p style={{ margin: 0, fontSize: '14px' }}>{q.comment}</p>
            </div>
        ) : null;

        switch (q.type) {
            case "SINGLE_CHOICE":
            case "MULTIPLE_CHOICE":
                const inputType = q.type === "SINGLE_CHOICE" ? 'radio' : 'checkbox';
                const markerClass = q.type === "SINGLE_CHOICE" ? "radio-circle-blue" : "checkbox-square-blue";

                return (
                    <>
                        <div className="choices">
                            {(q.options || []).map((opt, i) => {
                                const isSelected = q.selectedOptionIds?.includes(opt.optionId);
                                const isCorrectAnswer = q.correctOptionIds?.includes(opt.optionId);

                                let style = {};
                                if (isCorrectAnswer) {
                                    style = { backgroundColor: '#e6fffa', border: '1px solid #28a745', borderRadius: '8px' }; 
                                } else if (isSelected && !isCorrectAnswer) {
                                    style = { backgroundColor: '#ffebee', border: '1px solid #dc3545', borderRadius: '8px' }; 
                                }

                                return (
                                    <label className={q.type === "SINGLE_CHOICE" ? "custom-radio" : "custom-checkbox"} key={i} style={style}>
                                        <input
                                            className="choices-input"
                                            type={inputType}
                                            name={`review-q-${q.questionId}`}
                                            disabled
                                            checked={isSelected || isCorrectAnswer} 
                                        />
                                        <span className={markerClass} />
                                        
                                        {opt.optionText}

                                        {/* Іконки статусу */}
                                        {isCorrectAnswer && <span style={{ marginLeft: 'auto', color: 'green' }}>✅</span>}
                                        {isSelected && !isCorrectAnswer && <span style={{ marginLeft: 'auto', color: 'red' }}>❌</span>}
                                    </label>
                                );
                            })}
                        </div>
                        {commentBlock}
                    </>
                );

            case "TEXT":
                return (
                    <>
                        <textarea 
                            rows="4" 
                            value={q.userAnswer || ""} 
                            disabled 
                            style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9'}} 
                        />
                        <div style={{ marginTop: '10px', color: '#28a745' }}>
                            <small>Правильна відповідь: <strong>{q.correctAnswer}</strong></small>
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
                            <div style={{ marginBottom: '10px', color: '#007bff', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                Мова: {q.language}
                            </div>
                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '14px' }}>
                                {q.userCode || "// Код відсутній"}
                            </pre>

                            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '12px', color: '#666' }}>
                                <strong>Тест-кейси:</strong> {q.testCases}
                            </div>
                        </div>
                        {commentBlock}
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="testCreationMainPreview">
            <div className='container testReviewQuestionsContainer'>
                {questionsLink && questionsLink.length > 0 ? (
                    questionsLink.map((question, index) => (
                        <div
                            key={index}
                            className="test-container testReviewQuestionsTests"
                        >
                            <h2 className="question">
                                <span style={{ color: '#888', marginRight: '10px' }}>#{index + 1}</span>
                                {question.questionText}
                            </h2>

                            <div className="answer">
                                {renderQuestion(question)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: '#777', padding: '20px' }}>
                        Завантаження питань або список порожній...
                    </div>
                )}
                
                <div className="testDashboard__analytics-actions">
                    <button className="testDashboard__analytics-btn-dark" onClick={() => window.history.back()}>
                        Завершити перегляд
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TestReviewQuestions;