import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import DashboardTabNavigation from '../components/test_dashboard/DashboardTabNavigation/DashboardTabNavigation';
import TestDashboardList from '../components/test_dashboard/tabs/TestDashboardList/TestDashboardList';
import TestDashboardAnalytics from '../components/test_dashboard/tabs/TestDashboardAnalytics/TestDashboardAnalytics';

const TestDashboardPage = () => {
  const { id } = useParams(); // Отримуємо testId з URL
  const [activeTab, setActiveTab] = useState('registered');

  const [results, setResults] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (activeTab === 'results') {
          const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/tests/${id}/results`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await res.json();
          setResults(data);
        }

        if (activeTab === 'registered') {
          const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/tests/${id}/candidates`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await res.json();
          setCandidates(data);
        }

        if (activeTab === 'analytics') {
          const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/tests/${id}/analytics`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error(err);
        setError("Помилка при завантаженні даних");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, id]);

  const renderContent = () => {
    if (loading) return <p className="loading">Завантаження...</p>;
    if (error) return <p className="error">{error}</p>;

    switch (activeTab) {
      case 'analytics':
        return <TestDashboardAnalytics analytics={analytics} />;

      case 'registered':
        return <TestDashboardList 
                  activeTab={activeTab} 
                  students={candidates} 
                  setActiveTab={setActiveTab} 
                  testId={id}
               />;

      case 'results':
        return <TestDashboardList 
                  activeTab={activeTab} 
                  students={results} 
                  setActiveTab={setActiveTab} 
                  testId={id}
               />;

      default:
        return null;
    }
  };

  return (
    <div className='page'>
      <GeneralTestInfoHeader
        field="Data Science"
        title="JUNIOR DATA SCIENTIST"
        location="Lviv"
        date="21.03.2025"
        time="18:00"
      />

      <DashboardTabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {renderContent()}
    </div>
  );
};

export default TestDashboardPage;
