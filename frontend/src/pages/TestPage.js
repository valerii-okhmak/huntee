import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';                    
import { getAccessToken } from '../utils/auth'; 

import AboutTest from '../components/test_info/about_test/AboutTest';
import AboutWork from '../components/test_info/AboutWork';
import WorkResponsibilities from '../components/test_info/WorkResponsibilities';

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
                    `${process.env.REACT_APP_BACKEND}/api/tests/${testId}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );
                
                setTestData(response.data); 
                setError(null);
            } catch (err) {
                console.error("Помилка завантаження тесту:", err);
                setError(err.message || "Не вдалося завантажити дані тесту");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestDetails();
    }, [testId]); 

    if (isLoading) {
        return <div className="page"><div>Завантаження...</div></div>;
    }

    if (error) {
        return <div className="page"><div>Помилка: {error}</div></div>;
    }

    if (!testData) {
        return <div className="page"><div>Тест не знайдено.</div></div>;
    }

    const responsibilitiesList = testData.responsibilities 
        ? JSON.parse(testData.responsibilities) 
        : [];

    return (
        <div className="page">
            <AboutTest testData={testData} />
            <AboutWork vacancyDescription={testData.vacancyDescription} />
            <WorkResponsibilities responsibilities={responsibilitiesList} />
        </div>
    );
};

export default TestPage;