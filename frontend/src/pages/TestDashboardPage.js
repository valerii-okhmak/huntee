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
  const [test, setTest] = useState(null); // Дані тесту

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Завантаження самого тесту
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/tests/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('Помилка при завантаженні тесту');
        const data = await res.json();
        setTest(data);
      } catch (err) {
        console.error(err);
        setError('Не вдалося завантажити тест');
      }
    };

    fetchTest();
  }, [id]);

  // Завантаження вкладки
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
        return <TestDashboardAnalytics analytics={analytics} testId={id}/>;

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

  if (!test) return <p className="loading">Завантаження тесту...</p>;

  return (
    <div className='page'>
      <GeneralTestInfoHeader
        field={test.sphere}
        title={test.testName}
        location={test.city}
        date={new Date(test.startTime).toLocaleDateString()}
        time={new Date(test.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
