import React, { useEffect, useState, useMemo } from 'react'; 
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

  const [selectedGroupTag, setSelectedGroupTag] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setSelectedGroupTag('ALL'); 
        
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

  const uniqueGroups = useMemo(() => {
    const tags = students.map(s => s.groupTag).filter(Boolean); 
    return ['ALL', ...new Set(tags)];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            student.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGroup = selectedGroupTag === 'ALL' || student.groupTag === selectedGroupTag;
      
      return matchesSearch && matchesGroup;
    });
  }, [students, searchQuery, selectedGroupTag]);


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
            <input 
            type="text" 
            placeholder={t('testDashboardList.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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

      {uniqueGroups.length > 1 && ( 
        <div className="groups-filter-tabs" style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '5px' }}>
          {uniqueGroups.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroupTag(group)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: selectedGroupTag === group ? '2px solid #000' : '1px solid #ccc',
                background: selectedGroupTag === group ? '#000' : '#fff',
                color: selectedGroupTag === group ? '#fff' : '#000',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '13px'
              }}
            >
              {group === 'ALL' ? t('analytics.allGroups', 'Всі групи') : group}
              <span style={{ opacity: 0.7, marginLeft: '6px', fontSize: '11px' }}>
                ({group === 'ALL' ? students.length : students.filter(s => s.groupTag === group).length})
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="testDashboard__cards-list">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
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
        allStudents={filteredStudents} 
      />
    </div>
  )
}

export default TestDashboardList;