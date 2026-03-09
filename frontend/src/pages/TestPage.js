import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';

import AboutTest from '../components/test_info/about_test/AboutTest';
import AboutWork from '../components/test_info/AboutWork';
import WorkResponsibilities from '../components/test_info/WorkResponsibilities';
import RegisterButton from '../components/test_info/RegisterButton'; 
import Loader from '../components/loader/Loader';

const TestPage = () => {
    const { testId } = useParams();

    const [testData, setTestData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestDetails = async () => {
            if (!testId) return;

            setIsLoading(true);
            try {
                const token = getAccessToken();
                if (!token) throw new Error("Користувач не авторизований");

                const response = await axios.get(
                    `/api/tests/${testId}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                setTestData(response.data);
                setError(null);
            } catch (err) {
                console.error("Помилка завантаження тесту:", err);
                setError(err.response?.data?.message || err.message || "Не вдалося завантажити дані тесту");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestDetails();
    }, [testId]);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="page"><div>Помилка: {error}</div></div>;
    }

    if (!testData) {
        return <div className="page"><div>Тест не знайдено.</div></div>;
    }

    let responsibilitiesList = [];
    if (testData.responsibilities) {
        if (typeof testData.responsibilities === 'string') {
            try {
                responsibilitiesList = JSON.parse(testData.responsibilities);
            } catch (err) {
                console.warn("Не вдалося розпарсити responsibilities:", err);
                responsibilitiesList = [];
            }
        } else if (Array.isArray(testData.responsibilities)) {
            responsibilitiesList = testData.responsibilities;
        }
    }
    const hasVacancyDescription = testData.vacancyDescription && testData.vacancyDescription.trim() !== '';
    const hasResponsibilities = responsibilitiesList && responsibilitiesList.length > 0;

    return (
        <div className="page">
            <AboutTest testData={testData} />
        
            {hasVacancyDescription && (
                <AboutWork vacancyDescription={testData.vacancyDescription} />
            )}

            <div className="responsibilities-info">
                {hasResponsibilities && (
                    <WorkResponsibilities responsibilities={responsibilitiesList} />
                )}
                
                <RegisterButton testId={testId} />
            </div>
        </div>
    );
};

export default TestPage;