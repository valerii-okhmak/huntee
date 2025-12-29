import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import TestReviewGrading from '../components/TestReviewGrading/TestReviewGrading';
import TestReviewQuestions from '../components/TestReviewQuestions/TestReviewQuestions';

const TestReviewPage = () => {
  const { attemptId } = useParams(); 
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/api/attempts/${attemptId}/review`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setResultData(response.data);
      } catch (error) {
        console.error("Помилка завантаження результатів:", error);
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
        fetchResults();
    }
  }, [attemptId]);

  if (loading) return <div className="page"><div className="container">Завантаження...</div></div>;
  if (!resultData) return <div className="page"><div className="container">Результати не знайдено</div></div>;

  return (
    <div className='page'>
        <GeneralTestInfoHeader
            field={resultData.sphere || "Сфера"}
            title={resultData.testName || "Назва тесту"}
            name={resultData.candidateName || "Кандидат"}
        />

        <TestReviewGrading score={resultData.score} totalMaxScore={resultData.totalMaxScore} />

        <TestReviewQuestions questionsLink={resultData.questions} />
    </div>
  )
}

export default TestReviewPage;