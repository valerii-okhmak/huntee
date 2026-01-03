import React, { useEffect, useState } from 'react';
import './TestDashboardAnalytics.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faUsers } from "@fortawesome/free-solid-svg-icons";
import { getAccessToken } from '../../../../utils/auth';
import axios from 'axios';
import Loader from '../../../loader/Loader';

const TestDashboardAnalytics = ({ testId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `/api/tests/${testId}/analytics`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setAnalytics(response.data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити аналітику");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [testId]);

  if (loading) return <Loader />;
  if (error) return <div className='container'>{error}</div>;

  return (
    <div className='container'>
      <div className="testDashboard__description">
        <p>Тут ви можете переглянути детальну аналітику результатів тестування студентів. 
        Ви можете відстежувати середні оцінки, на які питання студенти відповідали найкраще, а на які — найгірше, а також визначати тенденції та слабкі місця.</p>
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
          <div className="testDashboard__analytics-icon">
            <FontAwesomeIcon icon={faCircleCheck}/>
          </div>
          <strong>{analytics.passedCount}</strong>
          <p>Студентів пройшло тест</p>
        </div>
        <div className="testDashboard__analytics-stat-card danger">
          <div className="testDashboard__analytics-icon">
            <FontAwesomeIcon icon={faCircleXmark}/>
          </div>
          <strong>{analytics.failedCount}</strong>
          <p>Студентів не пройшло тест</p>
        </div>
        <div className="testDashboard__analytics-stat-card total">
          <div className="testDashboard__analytics-icon">
            <FontAwesomeIcon icon={faUsers}/>
          </div>
          <strong>{analytics.totalAttempts}</strong>
          <p>Загальна кількість</p>
        </div>
      </div>
    </div>
  )
}

export default TestDashboardAnalytics;
