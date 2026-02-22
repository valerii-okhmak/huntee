import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getAccessToken } from '../utils/auth'; 
import Filters from '../components/tests/Filters/Filters';
import TestsBlock from '../components/tests/TestsBlock/TestsBlock';
import CustomTitle from '../components/custom_title/CustomTitle';
import { useLocation } from 'react-router-dom';
import Loader from '../components/loader/Loader';

const AllTestsPage = () => {
  const { t } = useTranslation();
  
  const object = {
    logo: null,
    line: true,
    strong: t('allTestsPage.title.strong'),
    p: t('allTestsPage.title.p')
  };

  const [allTests, setAllTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSpheres, setSelectedSpheres] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sphereParam = params.get('sphere');
    if (sphereParam) {
      setSelectedSpheres([sphereParam]);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const token = getAccessToken();
        const response = await axios.get(
          `/api/tests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const publicTestsOnly = response.data.filter(test => test.isPrivate === false);

        const mappedTests = publicTestsOnly.map(test => {
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
        setError(err.message || t('allTestsPage.error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, [t]);

  const filteredTests = useMemo(() => {
    return allTests.filter(test => {
      const locationMatch = selectedLocations.length === 0 || selectedLocations.includes(test.location);
      const sphereMatch = selectedSpheres.length === 0 || selectedSpheres.includes(test.type);
      return locationMatch && sphereMatch;
    });
  }, [allTests, selectedLocations, selectedSpheres]);

  return (
    <div className="page">
      <CustomTitle title={t('allTestsPage.mainTitle')} data={object} />
      <div className='testsMain container'>
        <Filters 
          allTests={allTests}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          selectedSpheres={selectedSpheres}
          setSelectedSpheres={setSelectedSpheres}
        />
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div>{t('allTestsPage.errorPrefix')}: {error}</div>
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