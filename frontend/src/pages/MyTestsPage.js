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

  const [selectedFilter, setSelectedFilter] = useState('Всі тести');

  useEffect(() => {
    const fetchMyTests = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `/api/tests/my`, 
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
            status: t.statusTest, // Використовуємо статус із бекенду (Active, Scheduled, Closed)
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

  // ОНОВЛЕНО: Підрахунок статистики за статусами
  const stats = useMemo(() => {
    return {
      total: tests.length,
      active: tests.filter(t => t.status === 'Active').length,
      scheduled: tests.filter(t => t.status === 'Scheduled').length,
      closed: tests.filter(t => t.status === 'Closed').length
    };
  }, [tests]);

  // ОНОВЛЕНО: Фільтрація списку
  const filteredTests = useMemo(() => {
    if (selectedFilter === 'Активні тести') {
      return tests.filter(t => t.status === 'Active');
    }
    if (selectedFilter === 'Заплановані тести') {
      return tests.filter(t => t.status === 'Scheduled');
    }
    if (selectedFilter === 'Завершені тести') {
      return tests.filter(t => t.status === 'Closed');
    }
    return tests;
  }, [tests, selectedFilter]);

  return (
    <div className="page">
      <CustomTitle title='Мої тести!' data={object} />
      <div className='testsMain container'>

        {/* Передаємо об'єкт stats замість окремих count */}
        <OurDataFilter
          selected={selectedFilter}
          onSelect={setSelectedFilter}
          stats={stats}
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