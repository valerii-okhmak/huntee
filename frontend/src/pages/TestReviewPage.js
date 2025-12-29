import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import TestReviewGrading from '../components/TestReviewGrading/TestReviewGrading';
import TestReviewQuestions from '../components/TestReviewQuestions/TestReviewQuestions';

const TestReviewPage = () => {
  const navigate = useNavigate();
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
        // Можна також перенаправляти тут, якщо помилка критична
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
        fetchResults();
    }
  }, [attemptId]);

  // ВИПРАВЛЕННЯ: Виносимо навігацію в окремий useEffect
  useEffect(() => {
    if (!loading && !resultData) {
      navigate('/notfound');
    }
  }, [loading, resultData, navigate]);

  if (loading) return <div className="page"><div className="container">Завантаження...</div></div>;
  
  // Якщо даних немає, але ми ще не встигли перенаправити (чекаємо useEffect),
  // повертаємо null, щоб не рендерити решту коду з помилками.
  if (!resultData) return null; 

  // Безпечна перевірка дати
  const isTimePassed = resultData.endTime 
    ? new Date() > new Date(resultData.endTime) 
    : false;

  const shouldShowQuestions = resultData.isShown || isTimePassed;

  return (
    <div className='page'>
        <GeneralTestInfoHeader
            field={resultData.sphere || "Сфера"}
            title={resultData.testName || "Назва тесту"}
            name={resultData.candidateName || "Кандидат"}
        />

        <TestReviewGrading score={resultData.score} totalMaxScore={resultData.totalMaxScore} />

        {shouldShowQuestions ? (
          <TestReviewQuestions questionsLink={resultData.questions} />
        ) : (
          <div className="container">
            <p className="modalmini-subtitle">
                Ваш бал може бути змінений викладачем при потребі!
            </p>
            <p className="modalmini-subtitle">
                Переглянути свої відповіді зможете після завершення тестування.
            </p>
          </div>
        )} 
    </div>
  );
};

export default TestReviewPage;