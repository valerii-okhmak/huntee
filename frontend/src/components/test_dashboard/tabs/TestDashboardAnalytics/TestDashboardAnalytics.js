import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './TestDashboardAnalytics.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faUsers, faHourglassHalf } from "@fortawesome/free-solid-svg-icons";
import { getAccessToken } from '../../../../utils/auth';
import axios from 'axios';
import Loader from '../../../loader/Loader';
import ExportResultsModal from '../../../modal_windows/ExportResultsModal'; 

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
} from 'chart.js';
import { Radar, Bar, Scatter } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, ArcElement
);

const TestDashboardAnalytics = ({ testId }) => {
  const { t } = useTranslation();
  
  const [analytics, setAnalytics] = useState(null);
  const [advancedData, setAdvancedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [availableGroups, setAvailableGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getAccessToken();
        const headers = { 'Authorization': `Bearer ${token}` };

        const [basicRes, advancedRes, groupsRes] = await Promise.allSettled([
            axios.get(`/api/tests/${testId}/analytics`, { headers }),
            axios.get(`/api/tests/${testId}/analytics/advanced`, { headers }),
            axios.get(`/api/tests/${testId}/groups`, { headers })
        ]);

        if (basicRes.status === 'fulfilled') {
            setAnalytics(basicRes.value.data);
        } else {
            throw new Error(t('testDashboardAnalytics.error'));
        }

        if (advancedRes.status === 'fulfilled') {
            setAdvancedData(advancedRes.value.data);
        } else {
            console.warn("Advanced analytics failed to load");
        }

        if (groupsRes.status === 'fulfilled') {
            setAvailableGroups(groupsRes.value.data);
        }

      } catch (err) {
        console.error(err);
        setError(t('testDashboardAnalytics.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testId, t]);

  const handleExportResults = async (params) => {
    setExportLoading(true);
    try {
      const token = getAccessToken();
      const response = await axios.post(
        `/api/tests/${testId}/export`,
        params,
        { 
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob' 
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = params.format === 'PDF' ? 'pdf' : 'xlsx';
      link.setAttribute('download', `results_${testId}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setIsExportModalOpen(false);
    } catch (err) {
      console.error("Export error:", err);
      alert("Не вдалося завантажити файл");
    } finally {
      setExportLoading(false);
    }
  };

  const radarData = advancedData ? {
    labels: Object.keys(advancedData.skillsProfile || {}),
    datasets: [
      {
        label: t('testDashboardAnalytics.charts.radarLabel'), 
        data: Object.values(advancedData.skillsProfile || {}),
        backgroundColor: 'rgba(108, 92, 231, 0.2)',
        borderColor: '#6c5ce7',
        borderWidth: 2,
      },
    ],
  } : null;

  const histData = advancedData ? {
    labels: Object.keys(advancedData.scoreDistribution || {}),
    datasets: [
      {
        label: t('testDashboardAnalytics.charts.histLabel'), 
        data: Object.values(advancedData.scoreDistribution || {}),
        backgroundColor: '#00b894',
      }
    ]
  } : null;

  const hardestData = advancedData ? {
    labels: (advancedData.hardestQuestions || []).map(q => 
        q.questionText.length > 20 ? q.questionText.substring(0, 20) + '...' : q.questionText
    ),
    datasets: [
      {
        label: t('testDashboardAnalytics.charts.hardestLabel'), 
        data: (advancedData.hardestQuestions || []).map(q => q.correctPercentage),
        backgroundColor: '#ff7675',
      }
    ]
  } : null;

  const scatterChartData = advancedData ? {
    datasets: [{
      label: t('testDashboardAnalytics.charts.scatterLabel'), 
      data: (advancedData.timeVsScore || []).map(p => ({ 
          x: p.durationMinutes || (p.durationSeconds / 60), 
          y: p.score 
      })),
      backgroundColor: '#0984e3',
    }]
  } : null;

  if (loading) return <Loader />;
  if (error) return <div className='container'>{error}</div>;

  return (
    <div className='container'>
      <div className="testDashboard__description">
        <p>{t('testDashboardAnalytics.description')}</p>
        <div className="testDashboard__quote">
           <p>{t('testDashboardAnalytics.avgScore')}: <strong>{analytics?.averageScore}%</strong></p>
        </div>
      </div>

      <div className="testDashboard__analytics-actions">
        <button 
          className="testDashboard__analytics-btn-dark"
          onClick={() => setIsExportModalOpen(true)}
        >
          {t('testDashboardAnalytics.downloadResults')}
        </button>
      </div>

      <div className="testDashboard__analytics-stats-row">
        <div className="testDashboard__analytics-stat-card success">
          <div className="testDashboard__analytics-icon"><FontAwesomeIcon icon={faCircleCheck}/></div>
          <strong>{analytics?.passedCount}</strong>
          <p>{t('testDashboardAnalytics.stats.passed')}</p>
        </div>

        <div className="testDashboard__analytics-stat-card danger">
          <div className="testDashboard__analytics-icon"><FontAwesomeIcon icon={faCircleXmark}/></div>
          <strong>{analytics?.failedCount}</strong>
          <p>{t('testDashboardAnalytics.stats.failed')}</p>
        </div>

        <div className="testDashboard__analytics-stat-card warning" style={{ borderColor: '#ffa502' }}>
          <div className="testDashboard__analytics-icon" style={{ color: '#ffa502', background: 'rgba(255, 165, 2, 0.1)' }}>
            <FontAwesomeIcon icon={faHourglassHalf}/>
          </div>
          <strong style={{ color: '#ffa502' }}>{analytics?.inReviewCount}</strong>
          <p>{t('testDashboardAnalytics.stats.review')}</p>
        </div>

        <div className="testDashboard__analytics-stat-card total">
          <div className="testDashboard__analytics-icon"><FontAwesomeIcon icon={faUsers}/></div>
          <strong>{analytics?.totalAttempts}</strong>
          <p>{t('testDashboardAnalytics.stats.total')}</p>
        </div>
      </div>

      {advancedData && (
        <div className="testDashboard__advanced-section">
            <h2 className="testDashboard__section-title">
                {t('testDashboardAnalytics.advancedTitle')}
            </h2>

            <div className="analytics-grid">
                
                <div className="analytics-card">
                    <h3>{t('testDashboardAnalytics.charts.radarTitle')}</h3>
                    <div className="chart-container">
                        <Radar data={radarData} options={{ scales: { r: { min: 0, max: 100 } } }} />
                    </div>
                    <p className="chart-hint">{t('testDashboardAnalytics.charts.radarHint')}</p>
                </div>

                <div className="analytics-card">
                    <h3>{t('testDashboardAnalytics.charts.histTitle')}</h3>
                    <div className="chart-container">
                        <Bar data={histData} />
                    </div>
                    <p className="chart-hint">{t('testDashboardAnalytics.charts.histHint')}</p>
                </div>

                <div className="analytics-card full-width">
                    <h3>{t('testDashboardAnalytics.charts.hardestTitle')}</h3>
                    <div className="chart-container-wide">
                        <Bar 
                            data={hardestData} 
                            options={{ 
                                indexAxis: 'y', 
                                scales: { x: { min: 0, max: 100 } },
                                plugins: { legend: { display: false } }
                            }} 
                        />
                    </div>
                </div>

                <div className="analytics-card">
                    <h3>{t('testDashboardAnalytics.charts.scatterTitle')}</h3>
                    <div className="chart-container">
                        <Scatter 
                            data={scatterChartData} 
                            options={{
                                scales: {
                                    x: { title: { display: true, text: t('testDashboardAnalytics.charts.axisMinutes') } },
                                    y: { title: { display: true, text: t('testDashboardAnalytics.charts.axisScore') } }
                                }
                            }} 
                        />
                    </div>
                </div>

            </div>
        </div>
      )}

      <ExportResultsModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportResults}
        loading={exportLoading}
        availableGroups={availableGroups}
      />
    </div>
  )
}

export default TestDashboardAnalytics;