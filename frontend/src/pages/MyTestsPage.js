import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getAccessToken } from '../utils/auth'; 
import OurDataFilter from '../components/my_tests/OurDataFilter/OurDataFilter';
import TestsBlock from '../components/my_tests/TestsBlock/TestsBlock';
import CustomTitle from '../components/custom_title/CustomTitle';

const MyTestsPage = () => {
  const object = { logo: null, line: true };

  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Для фільтра
  const [selectedFilter, setSelectedFilter] = useState('Всі тести');

  useEffect(() => {
    const fetchMyTests = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/api/tests/my`, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        const mappedTests = response.data.map(t => {
          const startDate = t.startTime ? new Date(t.startTime) : null;

          return {
            id: t.id,
            title: t.title || "Без назви",
            type: t.sphere || "Не вказано",
            location: t.city || "-",
            date: startDate ? startDate.toLocaleDateString("uk-UA") : "-",
            time: startDate ? startDate.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }) : "-",
            candidatesCount: t.candidatesCount ?? 0,
            link: `/testpage/${t.id}`
          };
        });
        
        setTests(mappedTests);
      } catch (error) {
        console.error("Помилка:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTests();
  }, []);

  // Підрахунок кількостей
  const totalCount = tests.length;
  const activeCount = tests.filter(t => t.type.toLowerCase() === 'active').length;
  const completedCount = tests.filter(t => t.type.toLowerCase() === 'completed').length;

  // Фільтрація за вибраним фільтром
  const filteredTests = useMemo(() => {
    if (selectedFilter === 'Активні тести') {
      return tests.filter(t => t.type.toLowerCase() === 'active');
    }
    if (selectedFilter === 'Завершені тести') {
      return tests.filter(t => t.type.toLowerCase() === 'completed');
    }
    return tests;
  }, [tests, selectedFilter]);

  return (
    <div className="page">
      <CustomTitle title='Мої тести!' data={object} />
      <div className='testsMain container'>

        <OurDataFilter
          selected={selectedFilter}
          onSelect={setSelectedFilter}
          totalCount={totalCount}
          activeCount={activeCount}
          completedCount={completedCount}
        />

        {isLoading ? (
          <div>Завантаження...</div>
        ) : error ? (
          <div>Помилка: {error}</div>
        ) : (
          <TestsBlock allTests={filteredTests} />
        )}
      </div>
    </div>
  );
}

export default MyTestsPage;
