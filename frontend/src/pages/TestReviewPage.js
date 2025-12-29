import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import TestReviewGrading from '../components/TestReviewGrading/TestReviewGrading';
import TestReviewQuestions from '../components/TestReviewQuestions/TestReviewQuestions';
import FinishTestInfoModal from '../components/modal_windows/FinishTestInfoModal';

const TestReviewPage = () => {
  const navigate = useNavigate();
  const { attemptId } = useParams(); 
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Видаляємо зайвий стейт isTestResultModalOpen, він тут не потрібен

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

  // --- ЛОГІКА ВІДОБРАЖЕННЯ ---

  if (resultData.isShown) {
    // Варіант 1: Результати доступні для перегляду
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
    );
  } else {
    // Варіант 2: Результати приховані -> показуємо тільки модалку
    // Ми просто рендеримо модалку з isOpen={true}.
    
    const handleClose = () => {
        // Якщо користувач закриває модалку, куди йому йти? 
        // Логічно перекинути його на список тестів, бо результати дивитись не можна.
        navigate('/mytests');
    };

    return (
      <FinishTestInfoModal
          isOpen={true} // Завжди відкрито, якщо ми потрапили в цей блок else
          onClose={handleClose} 
          score={resultData.score} // Перевірте, чи тут finalScore чи score
          totalMaxScore={resultData.totalMaxScore}
          onSubmitting={() => navigate(`/mytests`)}
        />
    );
  }
};

export default TestReviewPage;