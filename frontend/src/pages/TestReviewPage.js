import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAccessToken, getUserEmailFromToken } from '../utils/auth';
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import TestReviewGrading from '../components/TestReviewGrading/TestReviewGrading';
import TestReviewQuestions from '../components/TestReviewQuestions/TestReviewQuestions';
import Loader from '../components/loader/Loader';
import ConfirmFinalizeModal from '../components/modal_windows/ConfirmFinalizeModal'; 

const TestReviewPage = () => {
  const navigate = useNavigate();
  const { attemptId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false); 

  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);

  const currentUserEmail = getUserEmailFromToken(); 

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `/api/attempts/${attemptId}/review`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setResultData(response.data);
        
        if (response.data.authorEmail === currentUserEmail) {
            setIsAuthor(true); 
        }

      } catch (error) {
        console.error("Помилка завантаження результатів:", error);
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
        fetchResults();
    }
  }, [attemptId, currentUserEmail]);

  useEffect(() => {
    if (!loading && !resultData) {
      navigate('/notfound');
    }
  }, [loading, resultData, navigate]);

  const handleGradeAnswer = async (questionId, points, comment) => {
    try {
        const token = getAccessToken();
        await axios.post(
            `/api/attempts/${attemptId}/questions/${questionId}/grade`,
            { points, comment },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        setResultData(prev => ({
            ...prev,
            questions: prev.questions.map(q => 
                q.questionId === questionId 
                ? { ...q, isCorrect: points > 0, userAnswer: q.userAnswer }
                : q
            )
        }));
    } catch (e) {
        console.error(e);
    }
  };

  const handleFinalizeClick = () => {
      setIsFinalizeModalOpen(true);
  };

  const confirmFinalize = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.post(
            `/api/attempts/${attemptId}/finalize`,
            {},
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setResultData(prev => ({ ...prev, score: response.data.score })); 
        
        setIsFinalizeModalOpen(false);
        
        if (resultData && resultData.testId) {
            navigate(`/test/${resultData.testId}/dashboard`);
        } else {
            navigate('/viewingtests'); 
        }

      } catch (e) {
          console.error(e);
          setIsFinalizeModalOpen(false);
      }
  };

  if (loading) return <div className="page"><Loader /></div>;
  if (!resultData) return null; 

  const isPendingReview = resultData.score === null;
  const showGradingControls = isAuthor && isPendingReview;

  return (
    <div className='page'>
        <GeneralTestInfoHeader
            field={resultData.sphere || "Сфера"}
            title={resultData.testName || "Назва тесту"}
            name={resultData.candidateName || "Кандидат"}
        />

        <TestReviewGrading 
            score={resultData.score} 
            totalMaxScore={resultData.totalMaxScore} 
            isPending={isPendingReview}
        />
        
        <div className="container" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
            {showGradingControls ? (
                <button 
                    className="black-btn"
                    style={{ padding: '12px 24px', fontSize: '16px' }} 
                    onClick={handleFinalizeClick} 
                >
                    Завершити оцінювання
                </button>
            ) : (
                <button 
                    className="black-btn"
                    style={{ padding: '12px 24px', fontSize: '16px' }} 
                    onClick={() => {
                        // Якщо це автор (але перевірка вже завершена) — кидаємо на дашборд тесту
                        // Якщо це студент — кидаємо на сторінку "Мої тести"
                        if (isAuthor && resultData.testId) {
                            navigate(`/test/${resultData.testId}/dashboard`);
                        } else {
                            navigate('/mytests');
                        }
                    }} 
                >
                    {isAuthor ? 'Повернутися до дашборду' : 'Перейти до моїх тестів'}
                </button>
            )}
        </div>

        <TestReviewQuestions 
            questionsLink={resultData.questions} 
            isGradingMode={showGradingControls}
            onGrade={handleGradeAnswer}
        />

        <ConfirmFinalizeModal 
            isOpen={isFinalizeModalOpen}
            onClose={() => setIsFinalizeModalOpen(false)}
            onConfirm={confirmFinalize}
        />
    </div>
  );
};

export default TestReviewPage;