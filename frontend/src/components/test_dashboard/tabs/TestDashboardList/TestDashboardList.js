import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './TestDashboardList.css';
import DashboardStudentCard from '../../DashboardStudentCard/DashboardStudentCard';
import lupa from '../../../../img/search-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import InviteParticipantsModal from '../../../modal_windows/InviteParticipantsModal';
import SendMessageModal from '../../../modal_windows/SendMessageModal';
import axios from 'axios';
import { getAccessToken } from '../../../../utils/auth';
import Loader from '../../../loader/Loader';

const TestDashboardList = ({ activeTab, testId, setActiveTab }) => {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
        setError(t('testDashboardList.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [activeTab, testId, t]);

  const handleOpenGeneralMessage = () => {
    setSelectedStudent(null);
    setIsMessageModalOpen(true);
  };

  const handleOpenStudentMessage = (student) => {
    setSelectedStudent(student);
    setIsMessageModalOpen(true);
  };

  const description = activeTab === 'registered'
    ? t('testDashboardList.desc.registered')
    : t('testDashboardList.desc.results');

  if (loading) return <Loader />;
  if (error) return <div className='container'>{error}</div>;

  return (
    <div className='container'>
      <div className="testDashboard__description">
        <p>{description}</p>
        <div className="testDashboard__quote">
          <p>{t('testDashboardList.quote.line1')}</p>
          <p>{t('testDashboardList.quote.line2')}</p>
        </div>
      </div>

      <div className="testDashboard__toolbar">
        <div className="testDashboard__search-message-group">
          <div className="search-container">
            <img src={lupa} alt='search' className='search_icon' />
            <input type="text" placeholder={t('testDashboardList.search')}/>
          </div>
          
          <button 
              className="testDashboard__message" 
              title={t('testDashboardList.messageAll')}
              onClick={handleOpenGeneralMessage}
          >
            <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
          </button>
        </div>

        <button className="testDashboard__btn-analytics" onClick={() => setActiveTab('analytics')}>
          {t('testDashboardList.viewAnalytics')}
        </button>
      </div>

      <div className="testDashboard__btn-invite-container">
        <button 
          className="testDashboard__btn-invite" 
          onClick={() => setIsInviteModalOpen(true)}
        >
            {t('testDashboardList.invite')}
        </button>
      </div>

      <div className="testDashboard__cards-list">
        {students.length > 0 ? (
          students.map(student => (
            <DashboardStudentCard 
              key={student.userId} 
              student={student} 
              type={activeTab}
              onMessageClick={handleOpenStudentMessage}
            />
          ))
        ) : (
          <div style={{textAlign: 'center', padding: '20px', color: '#777'}}>
              {t('testDashboardList.empty')}
          </div>
        )}
      </div>

      <InviteParticipantsModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        testId={testId} 
      />

      <SendMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        student={selectedStudent}
        allStudents={students}
      />
    </div>
  )
}

export default TestDashboardList;