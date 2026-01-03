import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import DashboardTabNavigation from '../components/test_dashboard/DashboardTabNavigation/DashboardTabNavigation';
import TestDashboardList from '../components/test_dashboard/tabs/TestDashboardList/TestDashboardList';
import TestDashboardAnalytics from '../components/test_dashboard/tabs/TestDashboardAnalytics/TestDashboardAnalytics';
import Loader from '../components/loader/Loader';

const TestDashboardPage = () => {
  const { id } = useParams(); 
  const [activeTab, setActiveTab] = useState('registered');

  const [results, setResults] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [test, setTest] = useState(null); 

  const [loading, setLoading] = useState(true);
  const [testLoading, setTestLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setTestLoading(true); 
        const res = await fetch(`/api/tests/${id}`, {
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
      } finally {
        setTestLoading(false); 
      }
    };

    if (id) fetchTest();
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers = {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };

        if (activeTab === 'results') {
          const res = await fetch(`/api/tests/${id}/results`, { headers });
          const data = await res.json();
          setResults(data);
        }

        if (activeTab === 'registered') {
          const res = await fetch(`/api/tests/${id}/candidates`, { headers });
          const data = await res.json();
          setCandidates(data);
        }

        if (activeTab === 'analytics') {
          const res = await fetch(`/api/tests/${id}/analytics`, { headers });
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

    if (id) loadData();
  }, [activeTab, id]);

  const renderContent = () => {
    if (loading) return <Loader />;

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

  if (testLoading) {
      return <div className='page'><Loader /></div>;
  }

  if (!test) {
      return <div className='page'><div className='container'>Тест не знайдено</div></div>;
  }

  return (
    <div className='page'>
      <GeneralTestInfoHeader
        field={test.sphere}
        title={test.testName}
        location={test.city}
        date={test.startTime ? new Date(test.startTime).toLocaleDateString() : ''}
        time={test.startTime ? new Date(test.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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