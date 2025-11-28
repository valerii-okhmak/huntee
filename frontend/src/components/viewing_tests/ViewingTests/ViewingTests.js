import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';
import './ViewingTests.css';
import SearchBar from '../SearchBar/SearchBar';
import AddTestsButton from '../AddTestsButton/AddTestsButton';
import TestsList from '../TestsList/TestsList';
import FieldsFilter from '../Filters/FieldsFilter/FieldsFilter';
import OurDataFilter from '../Filters/OurDataFilter/OurDataFilter';

const ViewingTests = () => {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedFields, setSelectedFields] = useState([]); 
  const [selectedDataFilter, setSelectedDataFilter] = useState('Всі тести'); 

// 1. Завантаження тестів з API
  useEffect(() => {
    const fetchMyTests = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/api/tests/created`, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        console.log("Дані з сервера:", response.data); 

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
                link: `/dashboard/test/${t.id || t.testId}`
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

  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesField = selectedFields.length === 0 || 
                           selectedFields.includes('Всі') || 
                           selectedFields.includes(test.type);

      let matchesData = true;
      if (selectedDataFilter === 'Активні тести') matchesData = test.status === 'Active';
      return matchesSearch && matchesField && matchesData;
    });
  }, [tests, searchQuery, selectedFields, selectedDataFilter]);

  return (
    <div className="viewing-tests-page container">
      <div className="viewing-tests-left-side">
        <div className="viewing-tests-search-bar-container">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="viewing-tests-tests-list-section">
          {isLoading ? (
            <div>Завантаження...</div>
          ) : (
            <TestsList tests={filteredTests} />
          )}
        </div>
      </div>
      <div className="viewing-tests-right-side">
        <div className="viewing-tests-add-test-button-container">
          <AddTestsButton />
        </div>
        <div className="viewing-tests-filters-section">
          <OurDataFilter 
            selected={selectedDataFilter} 
            onSelect={setSelectedDataFilter}
            totalCount={tests.length} 
          />
          <FieldsFilter 
            selected={selectedFields}
            onSelect={setSelectedFields}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewingTests;