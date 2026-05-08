import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import DashboardTabNavigation from '../components/test_dashboard/DashboardTabNavigation/DashboardTabNavigation';
import TestDashboardList from '../components/test_dashboard/tabs/TestDashboardList/TestDashboardList';
import TestDashboardAnalytics from '../components/test_dashboard/tabs/TestDashboardAnalytics/TestDashboardAnalytics';
import Loader from '../components/loader/Loader';
import { getAccessToken } from '../utils/auth'; 

const TestDashboardPage = () => {
  const { id } = useParams(); 
  const [activeTab, setActiveTab] = useState('participants');

  const [participants, setParticipants] = useState([]); 
  const [analytics, setAnalytics] = useState(null);
  const [test, setTest] = useState(null); 

  const [loading, setLoading] = useState(true);
  const [testLoading, setTestLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setTestLoading(true); 
        const token = getAccessToken(); 
        
        const res = await fetch(`/api/tests/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.status === 401 || res.status === 403) {
           setError('У вас немає доступу до цього дашборду');
           return;
        }
        
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
        const token = getAccessToken(); 
        const headers = { 'Authorization': `Bearer ${token}` };

        if (activeTab === 'participants') {
          const [candidatesRes, resultsRes] = await Promise.all([
            fetch(`/api/tests/${id}/candidates`, { headers }),
            fetch(`/api/tests/${id}/results`, { headers })
          ]);

          if (candidatesRes.ok && resultsRes.ok) {
            const candidatesData = await candidatesRes.json();
            const resultsData = await resultsRes.json();

            const participantsMap = new Map();

            candidatesData.forEach(candidate => {
              participantsMap.set(candidate.userId, { ...candidate, status: 'REGISTERED' });
            });

            resultsData.forEach(result => {
              if (participantsMap.has(result.userId)) {
                participantsMap.set(result.userId, { ...participantsMap.get(result.userId), ...result });
              } else {
                participantsMap.set(result.userId, result);
              }
            });
            
            setParticipants(Array.from(participantsMap.values()));
          }
        }

        if (activeTab === 'analytics') {
          const res = await fetch(`/api/tests/${id}/analytics`, { headers });
          if(res.ok) {
              const data = await res.json();
              setAnalytics(data);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Помилка при завантаженні даних");
      } finally {
        setLoading(false);
      }
    };

    if (id && test) loadData(); 
  }, [activeTab, id, test]);


  const renderContent = () => {
    if (loading) return <Loader />;

    switch (activeTab) {
      case 'analytics':
        return <TestDashboardAnalytics analytics={analytics} testId={id}/>;

      case 'participants':
        return <TestDashboardList 
                  students={participants} 
                  setActiveTab={setActiveTab} 
                  testId={id}
                  isPrivate={test.isPrivate}
               />;

      default:
        return null;
    }
  };

  if (testLoading) return <div className='page'><Loader /></div>;
  if (!test) return <div className='page'><div className='container'>Тест не знайдено</div></div>;

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