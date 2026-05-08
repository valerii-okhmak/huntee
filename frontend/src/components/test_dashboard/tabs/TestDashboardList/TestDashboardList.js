import React, { useState, useMemo } from 'react'; 
import { useTranslation } from 'react-i18next';
import './TestDashboardList.css';
import lupa from '../../../../img/search-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import InviteParticipantsModal from '../../../modal_windows/InviteParticipantsModal';
import SendMessageModal from '../../../modal_windows/SendMessageModal';

// ЗВЕРНИ УВАГУ: Тепер ми просто приймаємо `students` у пропсах
const TestDashboardList = ({ students = [], testId, setActiveTab, isPrivate }) => {
  const { t } = useTranslation();
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [selectedGroupTag, setSelectedGroupTag] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenGeneralMessage = () => {
    setSelectedStudent(null);
    setIsMessageModalOpen(true);
  };

  const handleOpenStudentMessage = (student) => {
    setSelectedStudent(student);
    setIsMessageModalOpen(true);
  };

  // Фільтрація по групах тепер працює відразу з готового пропса students
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

  const description = t('testDashboardList.desc.all', 'Тут ви можете переглянути зареєстрованих учасників та їхні результати тестування...');

  return (
    <div className='container'>
      <div className="testDashboard__description">
        <p>{description}</p>
        <div className="testDashboard__quote">
          <p>{t('testDashboardList.quote.line1', 'Щоб надіслати повідомлення всім студентам, натисніть кнопку повідомлення поруч з пошуком.')}</p>
          <p>{t('testDashboardList.quote.line2', 'Щоб зв’язатися з окремим студентом, використовуйте кнопку «Повідомлення» у його рядку.')}</p>
        </div>
      </div>

      <div className="testDashboard__toolbar">
        <div className="testDashboard__search-message-group">
          <div className="search-container">
            <img src={lupa} alt='search' className='search_icon' />
            <input 
              type="text" 
              placeholder={t('testDashboardList.search', 'Пошук')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
              className="testDashboard__message" 
              title={t('testDashboardList.messageAll', 'Надіслати всім')}
              onClick={handleOpenGeneralMessage}
          >
            <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
          </button>
        </div>

        <button className="testDashboard__btn-analytics" onClick={() => setActiveTab('analytics')}>
          {t('testDashboardList.viewAnalytics', 'Переглянути аналітику')}
        </button>
      </div>

      <div className="testDashboard__btn-invite-container">
        <button 
          className="testDashboard__btn-invite" 
          onClick={() => setIsInviteModalOpen(true)}
        >
            {t('testDashboardList.invite', 'Запросити учасників')}
        </button>
      </div>

      {uniqueGroups.length > 1 && ( 
        <div className="testDashboard__groups-filter-tabs">
          {uniqueGroups.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroupTag(group)}
              className={`testDashboard__group-btn ${selectedGroupTag === group ? 'testDashboard__group-btn--active' : ''}`}
            >
              {group === 'ALL' ? t('analytics.allGroups', 'Всі групи') : group}
              <span className="testDashboard__group-btn-count">
                ({group === 'ALL' ? students.length : students.filter(s => s.groupTag === group).length})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ТАБЛИЦЯ */}
      <div className="testDashboard__table-wrapper">
        <table className="testDashboard__table">
          <thead>
            <tr>
              <th>{t('table.name', 'Учасник')}</th>
              <th>{t('table.group', 'Група')}</th>
              <th>{t('table.status', 'Статус')}</th>
              <th>{t('table.result', 'Результат')}</th>
              <th className="td-actions-head">{t('table.actions', 'Дії')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => {
                const isCompleted = student.status === 'COMPLETED';

                return (
                  <tr key={student.userId}>
                    {/* ІМ'Я ТА EMAIL */}
                    <td className="td-participant">
                      <span className="participant-name">{student.fullName}</span>
                      <span className="participant-email">{student.email}</span>
                    </td>
                    
                    {/* ГРУПА */}
                    <td style={{ fontSize: 'clamp(10px, 5vw, 16px)' }}>
                      {student.groupTag && student.groupTag !== '-' ? student.groupTag : '—'}
                    </td>
                    
                    {/* СТАТУС */}
                    <td>
                      {isCompleted ? (
                        <span className="status-text text-completed">Пройшов</span>
                      ) : (
                        <span className="status-text text-registered">Зареєстровано</span>
                      )}
                    </td>
                    
                    {/* РЕЗУЛЬТАТ */}
                    <td>
                      {isCompleted && student.score !== null && student.score !== undefined ? (
                        <span className={`score-badge ${student.score > 0 ? 'score-good' : 'score-bad'}`}>
                          {student.score}/{student.totalMaxScore}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    
                    {/* ДІЇ (ТІЛЬКИ ПОВІДОМЛЕННЯ) */}
                    <td className="td-actions">
                      <button 
                        className="action-icon-btn" 
                        onClick={() => handleOpenStudentMessage(student)}
                        title={t('testDashboardList.sendMessage', 'Надіслати повідомлення')}
                      >
                        <FontAwesomeIcon icon={faEnvelope} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="table-empty-state">
                  {t('testDashboardList.empty', 'Список порожній')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <InviteParticipantsModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        testId={testId} 
        isPrivate={isPrivate}
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