import React from 'react'
import './DashboardStudentCard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

const DashboardStudentCard = ({ student, type }) => {
  return (
    <div className="testDashboard__student-card">
      <div className="testDashboard__card-content">
        <h3 className="testDashboard__card-name">{student.fullName}</h3>

        {type === 'results' && (
          <>
            <div 
              className={`testDashboard__card-score ${
                student.score === null 
                  ? 'testDashboard__card-score-null' 
                  : student.score >= 50 
                    ? 'testDashboard__card-score-good' 
                    : 'testDashboard__card-score-bad' 
              }`}
            >
              {student.score === null ? 'Тест не пройдено' : `${student.score}%`}
            </div>
            <a href="#" className="testDashboard__card-info">Переглянути інформацію про студента</a>
          </>
        )}
      </div>

      <div className="testDashboard__card-actions">
        {type === 'registered' ? (
           <button className="testDashboard__card-btn">Переглянути профіль</button>
        ) : (
           <button className="testDashboard__card-btn">Переглянути результати</button>
        )}
        <button className="testDashboard__card-btn-chat">
          <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
        </button>
      </div>
    </div>
  )
}

export default DashboardStudentCard
