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
            case "choice":
                return (
                    <>
                        <div className="choices">
                            {(q.options || []).map((opt, i) => (
                                <label className="custom-radio" key={i}>
                                    <input
                                        className="choices-input"
                                        type="radio"
                                        name={`preview-q-${q.id || Math.random()}`} // Унікальне ім'я для групи радіо-кнопок
                                        disabled
                                        checked={opt.isCorrect}
                                    />
                                    <span className="radio-circle-blue radio-circle-red" />
                                    {opt.optionText}
                                </label>
                            ))}
                        </div>
                        {commentBlock}
                    </>
                );

            case "multiple":
                return (
                    <>
                        <div className="choices">
                            {(q.options || []).map((opt, i) => (
                                <label className="custom-checkbox" key={i}>
                                    <input
                                        className="choices-input"
                                        type="checkbox"
                                        disabled
                                        checked={opt.isCorrect}
                                    />
                                    <span className="checkbox-square-blue checkbox-square-green" />
                                    {opt.optionText}
                                </label>
                            ))}
                        </div>
                        {commentBlock}
                    </>
                );

            case "text":
                return (
                    <>
                        <textarea rows="4" placeholder="Ваша відповідь..." disabled className="preview-textarea" />
                        <div style={{ marginTop: '10px', color: '#28a745' }}>
                            <small>Правильна відповідь: <strong>{q.correctAnswer}</strong></small>
                        </div>
                        {commentBlock}
                    </>
                );

            case "code":
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
                                Мова: {q.codeAnswer?.language}
                            </div>
                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '14px' }}>
                                {q.codeAnswer?.templateCode || "// Тут буде код студента"}
                            </pre>

                            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '12px', color: '#666' }}>
                                <strong>Тест-кейси:</strong> {q.codeAnswer?.testCases}
                            </div>
                        </div>
                        {commentBlock}
                    </>
                );

            default:
                return (
                    <div style={{ color: 'red' }}>
                        Невідомий тип питання: {q.questionType}
                    </div>
                );
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
                                {question.question}
                            </h2>

                            <div className="answer">
                                {renderQuestion(question)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: '#777', padding: '20px' }}>
                        Список питань порожній
                    </div>
                )}
                <div className="testDashboard__analytics-actions">
                    <button className="testDashboard__analytics-btn-dark">Завершити перегляд</button>
                </div>
            </div>
        </div>
    )
}

export default TestReviewQuestions;