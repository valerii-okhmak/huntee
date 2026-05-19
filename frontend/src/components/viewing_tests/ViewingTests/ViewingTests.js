import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';
import './ViewingTests.css';
import SearchBar from '../SearchBar/SearchBar';
import AddTestsButton from '../AddTestsButton/AddTestsButton';
import TestsList from '../TestsList/TestsList';
import FieldsFilter from '../Filters/FieldsFilter/FieldsFilter';
import OurDataFilter from '../Filters/OurDataFilter/OurDataFilter';
import Loader from '../../loader/Loader';

const ViewingTests = () => {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedFields, setSelectedFields] = useState([]); 
  const [selectedDataFilter, setSelectedDataFilter] = useState('Всі тести'); 

  const MAX_TESTS = 5;

  useEffect(() => {
    const fetchMyTests = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `/api/tests/created`, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        const mappedTests = response.data.map(t => {
            let dateStr = 'Дата не вказана';
            let timeStr = '';

            if (t.startTime) {
                const dateObj = new Date(t.startTime);
                if (!isNaN(dateObj.getTime())) { 
                    dateStr = dateObj.toLocaleDateString('uk-UA');
                    timeStr = dateObj.toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'});
                }
            }

            return {
                id: t.id || t.testId, 
                title: t.title || t.testName || 'Без назви', 
                type: t.sphere || 'Не вказано',
                location: t.city || 'Онлайн',
                date: dateStr,
                time: timeStr,
                candidatesCount: t.candidatesCount || 0,
                status: t.status, 
                link: `/test/${t.id || t.testId}/dashboard`
            };
        });

        setTests(mappedTests);
      } catch (error) {
        console.error("Помилка завантаження тестів:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTests();
  }, []);

  const stats = useMemo(() => {
    return {
      total: tests.length,
      active: tests.filter(t => t.status === 'Active').length,
      scheduled: tests.filter(t => t.status === 'Scheduled').length,
      closed: tests.filter(t => t.status === 'Closed').length
    };
  }, [tests]);

  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesField = selectedFields.length === 0 || 
                          selectedFields.includes(test.type);

      let matchesData = true;
      if (selectedDataFilter === 'Активні тести') {
          matchesData = test.status === 'Active';
      } else if (selectedDataFilter === 'Заплановані тести') {
          matchesData = test.status === 'Scheduled';
      } else if (selectedDataFilter === 'Завершені тести') {
          matchesData = test.status === 'Closed';
      }
      
      return matchesSearch && matchesField && matchesData;
    });
  }, [tests, searchQuery, selectedFields, selectedDataFilter]);

  const spheresWithCounts = useMemo(() => {
    const counts = {};
    tests.forEach(t => {
      if (t.type) {
        counts[t.type] = (counts[t.type] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [tests]);

  const handleDeleteTest = (id) => {
    setTests(prevTests => prevTests.filter(test => test.id !== id));
  };

  const isLimitReached = stats.total >= MAX_TESTS;

  return (
    <div className="viewing-tests-page container">
      <div className="viewing-tests-left-side">
        <div className="viewing-tests-search-bar-container">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="viewing-tests-tests-list-section">
          {isLoading ? (
            <Loader />
          ) : (
            <TestsList tests={filteredTests} onDeleteTest={handleDeleteTest}/>
          )}
        </div>
      </div>
      <div className="viewing-tests-right-side">
        
        <div className="viewing-tests-add-test-button-container">
          <div className={`add-button-wrapper ${isLimitReached ? 'disabled-wrapper' : ''}`}>
            <div className={`tests-limit-counter ${isLimitReached ? 'limit-reached' : ''}`}>
              <strong>{stats.total}/{MAX_TESTS}</strong>
            </div>
            <AddTestsButton disabled={isLimitReached} />
          </div>

          {isLimitReached && (
            <p className="limit-warning-text">
              Ви досягли ліміту! Видаліть старі тести, щоб створити нові.
            </p>
          )}
        </div>

        <div className="viewing-tests-filters-section">
          <OurDataFilter 
            selected={selectedDataFilter} 
            onSelect={setSelectedDataFilter}
            stats={stats} 
          />
          <FieldsFilter 
            selected={selectedFields}
            onSelect={setSelectedFields}
            spheres={spheresWithCounts}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewingTests;