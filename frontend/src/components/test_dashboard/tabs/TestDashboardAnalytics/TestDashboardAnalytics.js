import React from 'react'
import './TestDashboardAnalytics.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faUsers } from "@fortawesome/free-solid-svg-icons";

const TestDashboardAnalytics = () => {
  const description = 'Тут ви можете переглянути детальну аналітику результатів тестування студентів. \nВи можете відстежувати середні оцінки, на які питання студенти відповідали найкраще, а на які — найгірше, а також визначати тенденції та слабкі місця.'

  return (
    <div className='container'>
        <div className="testDashboard__description">
            <p>{description}</p>
            <div className="testDashboard__quote">
                <p>Використовуйте графіки та таблиці, щоб швидко оцінити успішність студентів за окремими питаннями.</p>
                <p>Клік на окремого студента дозволяє переглянути його індивідуальні результати та слабкі питання.</p>
            </div>
        </div>
        <div className="testDashboard__analytics-actions">
          <button className="testDashboard__analytics-btn-dark">Завантажити результати</button>
        </div>
        <div className="testDashboard__analytics-stats-row">
          <div className="testDashboard__analytics-stat-card success">
            <div className="testDashboard__analytics-icon"><FontAwesomeIcon icon={faCircleCheck}/></div>
            <strong>20</strong>
            <p>Студентів пройшло тест</p>
          </div>
          <div className="testDashboard__analytics-stat-card danger">
            <div className="testDashboard__analytics-icon"><FontAwesomeIcon icon={faCircleXmark}/></div>
            <strong>1</strong>
            <p>Студентів не пройшло тест</p>
          </div>
          <div className="testDashboard__analytics-stat-card total">
            <div className="testDashboard__analytics-icon"><FontAwesomeIcon icon={faUsers}/></div>
            <strong>21</strong>
            <p>Загальна кількість</p>
          </div>
        </div>
    </div>
  )
}

export default TestDashboardAnalytics