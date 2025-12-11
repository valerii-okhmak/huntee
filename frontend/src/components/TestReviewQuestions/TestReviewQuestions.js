import React from "react";
import './TestReviewQuestions.css';
import { useNavigate } from "react-router-dom";

const TestReviewQuestions = ({ questionsLink = [] }) => {

    const navigate = useNavigate();

    const renderQuestion = (q) => {
        if (!q) return null;

        const commentBlock = q.comment ? (
            <div
                className="preview-comment"
                style={{
                    marginTop: '15px',
                    padding: '10px',
                    background: '#f9f9f9',
                    borderRadius: '5px',
                    borderLeft: '4px solid #007bff'
                }}
            >
                <small style={{ fontWeight: 'bold', color: '#555' }}>Підказка:</small>
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

                                let markerClassToUse = q.type === "SINGLE_CHOICE" ? "radio-circle-blue " : "checkbox-square-blue "; // За замовчуванням

                                if (isSelected && isCorrectAnswer) {
                                    markerClassToUse += correctMarkerClass; // Правильна відповідь
                                } else if (isSelected && !isCorrectAnswer) {
                                    markerClassToUse += incorrectMarkerClass; // Обрано, але неправильно
                                }

                                return (
                                    <label
                                        className={q.type === "SINGLE_CHOICE" ? "custom-radio" : "custom-checkbox"}
                                        key={i}
                                    >
                                        <input
                                            className="choices-input"
                                            type={inputType}
                                            name={`review-q-${q.questionId}`}
                                            disabled
                                            checked={isSelected}
                                        />

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
    const isCorrect = q.userAnswer?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();
    return (
        <>
            <textarea
                rows="4"
                value={q.userAnswer || ""}
                disabled
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f9f9f9'
                }}
            />

            <div style={{ marginTop: '10px' }}>
                <small style={{ 
                    color: isCorrect ? '#28a745' : '#C32C2C',
                    fontWeight: 'bold'
                }}>
                    {isCorrect ? "Відповідь правильна" : "Відповідь неправильна"}
                </small>
            </div>

            {commentBlock}
        </>
    );
            case "CODE":
                return (
                    <>
                        <div
                            className="code-preview"
                            style={{
                                background: '#ffffff',
                                color: '#333',
                                border: '1px solid #ccc',
                                padding: '15px',
                                borderRadius: '5px',
                                fontFamily: 'monospace',
                                overflowX: 'auto',
                            }}
                        >
                            <div
                                style={{
                                    marginBottom: '10px',
                                    color: '#007bff',
                                    fontWeight: 'bold',
                                    borderBottom: '1px solid #eee',
                                    paddingBottom: '5px'
                                }}
                            >
                                Мова: {q.language}
                            </div>

                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '14px' }}>
                                {q.userCode || "// Код відсутній"}
                            </pre>

                            <div
                                style={{
                                    marginTop: '15px',
                                    borderTop: '1px solid #eee',
                                    paddingTop: '10px',
                                    fontSize: '12px',
                                    color: '#666'
                                }}
                            >
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
            <div className="container testReviewQuestionsContainer">

                {questionsLink && questionsLink.length > 0 ? (
                    questionsLink.map((q, index) => (
                        <div key={index} className="test-container testReviewQuestionsTests">
                            <h2 className="question">
                                <span style={{ color: '#888', marginRight: '10px' }}>
                                    #{index + 1}
                                </span>
                                {q.questionText}
                            </h2>

                            <div className="answer">
                                {renderQuestion(q)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: '#777', padding: '20px' }}>
                        Завантаження питань або список порожній...
                    </div>
                )}

                <div className="testDashboard__analytics-actions">
                    <button
                        className="testDashboard__analytics-btn-dark"
                        onClick={() => navigate('/')}
                    >
                        Завершити перегляд
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestReviewQuestions;
