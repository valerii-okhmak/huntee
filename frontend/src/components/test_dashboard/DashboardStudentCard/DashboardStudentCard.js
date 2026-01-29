import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardStudentCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

const DashboardStudentCard = ({ student, type }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (student.userId) {
      navigate(`/profile/${student.userId}`);
    }
  };

  const handleViewResults = () => {
    if (student.attemptId) {
      navigate(`/testreview/${student.attemptId}`);
    } else {
      console.error("Не знайдено ID спроби (attemptId) для цього студента:", student);
    }
  };

  const maxScore = student.totalMaxScore || 100;
  const score = student.score;
  const successPercentage = score ? (score / maxScore) * 100 : 0;
  const isPassed = successPercentage >= 60; 

  const isPendingReview = type === 'results' && score === null;

  return (
    <div className="testDashboard__student-card">
      <div className="testDashboard__card-content">
        <h3 className="testDashboard__card-name">{student.fullName}</h3>

        {type === 'results' && (
          <>
            <div 
              className={`testDashboard__card-score ${
                isPendingReview
                  ? 'testDashboard__card-score-pending' 
                  : isPassed
                    ? 'testDashboard__card-score-good'  
                    : 'testDashboard__card-score-bad'   
              }`}
            >
              {isPendingReview 
                  ? 'На перевірці' 
                  : `${score}/${maxScore}`
              }
            </div>
            
            <span 
                onClick={handleViewResults} 
                className="testDashboard__card-info" 
                style={{cursor: 'pointer', textDecoration: 'underline'}}
            >
                Переглянути деталі
            </span>
          </>
        )}
      </div>

      <div className="testDashboard__card-actions">
        {type === 'registered' ? (
           <button className="testDashboard__card-btn" onClick={handleViewProfile}>
               Переглянути профіль
           </button>
        ) : (
           <button className="testDashboard__card-btn" onClick={handleViewResults}>
               {isPendingReview ? 'Перевірити тест' : 'Переглянути результати'}
           </button>
        )}
        
        <button className="testDashboard__card-btn-chat" title="Написати повідомлення">
          <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
        </button>
      </div>
    </div>
  );
};

export default DashboardStudentCard;