import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getAccessToken } from '../utils/auth'; 
import Filters from '../components/tests/Filters/Filters';
import TestsBlock from '../components/tests/TestsBlock/TestsBlock';
import CustomTitle from '../components/custom_title/CustomTitle';

const AllTestsPage = () => {
  const object = {
    logo: null,
    line: true,
    strong: 'Вакансії для початківців в IT',
    p: 'Обери найкращу сферу для себе та зроби перший крок!'
  };

  const [allTests, setAllTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSpheres, setSelectedSpheres] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const token = getAccessToken();
        if (!token) throw new Error('Користувач не авторизований');

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/api/tests`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        const mappedTests = response.data.map(test => {
          const startDate = new Date(test.startTime);
          return {
            id: test.testId,
            title: test.testName,
            type: test.sphere,
            location: test.city,
            date: startDate.toLocaleDateString('uk-UA'),
            time: startDate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
            link: `/testpage/${test.testId}`
          };
        });

        setAllTests(mappedTests);
        setError(null);
      } catch (err) {
        console.error("Помилка завантаження тестів:", err);
        setError(err.message || 'Не вдалося завантажити тести');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  const filteredTests = useMemo(() => {
    return allTests.filter(test => {
      const locationMatch = selectedLocations.length === 0 || selectedLocations.includes(test.location);
      const sphereMatch = selectedSpheres.length === 0 || selectedSpheres.includes(test.type);
      const timeMatch = selectedTimes.length === 0 || selectedTimes.includes(test.time);
      
      return locationMatch && sphereMatch && timeMatch;
    });
  }, [allTests, selectedLocations, selectedSpheres, selectedTimes]);

  return (
    <div className="page">
      <CustomTitle title='Приєднуйся!' data={object} />
      <div className='testsMain container'>
        <Filters 
          allTests={allTests}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          selectedSpheres={selectedSpheres}
          setSelectedSpheres={setSelectedSpheres}
          selectedTimes={selectedTimes}
          setSelectedTimes={setSelectedTimes}
        />
        
        {isLoading ? (
          <div>Завантаження...</div>
        ) : error ? (
          <div>Помилка: {error}</div>
        ) : (
          <TestsBlock 
            allTests={filteredTests}
            selectedLocations={selectedLocations} 
          />
        )}
      </div>
    </div>
  );
}

export default AllTestsPage;