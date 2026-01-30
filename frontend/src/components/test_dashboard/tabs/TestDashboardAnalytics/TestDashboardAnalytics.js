import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './TestDashboardAnalytics.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faUsers, faHourglassHalf } from "@fortawesome/free-solid-svg-icons";
import { getAccessToken } from '../../../../utils/auth';
import axios from 'axios';
import Loader from '../../../loader/Loader';

const TestDashboardAnalytics = ({ testId }) => {
  const { t } = useTranslation();
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
        setError(t('testDashboardAnalytics.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [testId, t]);

  if (loading) return <Loader />;
  if (error) return <div className='container'>{error}</div>;

  return (
    <div className='container'>
      <div className="testDashboard__description">
        <p>{t('testDashboardAnalytics.description')}</p>
        <div className="testDashboard__quote">
           <p>{t('testDashboardAnalytics.avgScore')}: <strong>{analytics.averageScore}%</strong></p>
        </div>
      </div>

      <div className="testDashboard__analytics-actions">
        <button className="testDashboard__analytics-btn-dark">{t('testDashboardAnalytics.downloadResults')}</button>
      </div>

      <div className="testDashboard__analytics-stats-row">
        <div className="testDashboard__analytics-stat-card success">
          <div className="testDashboard__analytics-icon">
            <FontAwesomeIcon icon={faCircleCheck}/>
          </div>
          <strong>{analytics.passedCount}</strong>
          <p>{t('testDashboardAnalytics.stats.passed')}</p>
        </div>

        <div className="testDashboard__analytics-stat-card danger">
          <div className="testDashboard__analytics-icon">
            <FontAwesomeIcon icon={faCircleXmark}/>
          </div>
          <strong>{analytics.failedCount}</strong>
          <p>{t('testDashboardAnalytics.stats.failed')}</p>
        </div>

        <div className="testDashboard__analytics-stat-card warning" style={{ borderColor: '#ffa502' }}>
          <div className="testDashboard__analytics-icon" style={{ color: '#ffa502', background: 'rgba(255, 165, 2, 0.1)' }}>
            <FontAwesomeIcon icon={faHourglassHalf}/>
          </div>
          <strong style={{ color: '#ffa502' }}>{analytics.inReviewCount}</strong>
          <p>{t('testDashboardAnalytics.stats.review')}</p>
        </div>

        <div className="testDashboard__analytics-stat-card total">
          <div className="testDashboard__analytics-icon">
            <FontAwesomeIcon icon={faUsers}/>
          </div>
          <strong>{analytics.totalAttempts}</strong>
          <p>{t('testDashboardAnalytics.stats.total')}</p>
        </div>
      </div>
    </div>
  )
}

export default TestDashboardAnalytics;