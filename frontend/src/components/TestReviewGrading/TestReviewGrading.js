import React from 'react';
import './TestReviewGrading.css';
import { Link } from 'react-router-dom';

const TestReviewGrading = ({ score }) => {
  const isPassed = score >= 60; 
  const containerClass = isPassed ? 'testReviewGrading testReviewGrading-green' : 'testReviewGrading testReviewGrading-red';
  const scoreClass = isPassed ? 'testReviewGrading__title-green' : 'testReviewGrading__title-red'; // Припускаємо, що у вас є клас для червоного тексту

  return (
    <div className={containerClass}>
        <div className='container'>
            <h2 className='testReviewGrading__title'>
                Ваша оцінка: <span className={scoreClass}>{score}%</span>
            </h2>
            <p className='testReviewGrading__text'>Для заліку необхідно отримати принаймні 60%</p>
            
            <Link to="/viewingtests">
                <button className="testDashboard__analytics-btn-dark">
                    До моїх тестів
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
            </Link>
            
        </div>
    </div>
  )
}

export default TestReviewGrading;