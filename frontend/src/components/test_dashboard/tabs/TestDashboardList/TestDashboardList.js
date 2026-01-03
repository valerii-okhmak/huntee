import React, { useEffect, useState } from 'react';
import './TestDashboardList.css';
import DashboardStudentCard from '../../DashboardStudentCard/DashboardStudentCard';
import lupa from '../../../../img/search-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import InviteParticipantsModal from '../../../modal_windows/InviteParticipantsModal';
import axios from 'axios';
import { getAccessToken } from '../../../../utils/auth';

const TestDashboardList = ({ activeTab, testId, setActiveTab }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Стейт для керування модалкою
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = getAccessToken();
        const endpoint = activeTab === 'registered' 
          ? `/api/tests/${testId}/candidates`
          : `/api/tests/${testId}/results`;
        
        const response = await axios.get(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setStudents(response.data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити студентів");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [activeTab, testId]);

  const description = activeTab === 'registered'
    ? 'Тут ви можете переглянути зареєстрованих студентів. Ви можете надіслати автоматичне повідомлення всім студентам або звернутися до кожного окремо.'
    : 'Тут ви можете переглянути результати тестування студентів. Ви можете надіслати автоматичне повідомлення всім студентам або звернутися до кожного окремо, щоб повідомити про результат чи надати зворотний зв’язок.';

  if (loading) return <div className='container'>Завантаження студентів...</div>;
  if (error) return <div className='container'>{error}</div>;

  return (
    <div className='container'>
      <div className="testDashboard__description">
        <p>{description}</p>
        <div className="testDashboard__quote">
          <p>Щоб надіслати повідомлення всім студентам, натисніть кнопку повідомлення поруч з пошуком.</p>
          <p>Щоб зв’язатися з окремим студентом, використовуйте кнопку «Повідомлення» поруч із його результатом.</p>
        </div>
      </div>

      <div className="testDashboard__toolbar">
        <div className="search-container">
          <img src={lupa} alt='search' className='search_icon' />
          <input type="text" placeholder="Пошук"/>
        </div>
        <button className="testDashboard__message">
          <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
        </button>
        <button className="testDashboard__btn-analytics" onClick={() => setActiveTab('analytics')}>
          Переглянути аналітику
        </button>
      </div>

      <div className="testDashboard__btn-invite-container">
        {/* 2. Прив'язка функції відкриття до кнопки */}
        <button 
          className="testDashboard__btn-invite" 
          onClick={() => setIsInviteModalOpen(true)}
        >
            Запросити учасників
        </button>
      </div>

      <div className="testDashboard__cards-list">
        {students.map(student => (
          <DashboardStudentCard 
            key={student.userId} 
            student={student} 
            type={activeTab}
          />
        ))}
      </div>

      {/* 3. Передача стейту та функції закриття в модалку */}
      <InviteParticipantsModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        testId={testId} 
      />
    </div>
  )
}

export default TestDashboardList;