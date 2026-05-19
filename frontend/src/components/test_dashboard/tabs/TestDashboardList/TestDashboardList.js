import React, { useState, useMemo } from 'react'; 
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; 
import './TestDashboardList.css';
import lupa from '../../../../img/search-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'; 
import InviteParticipantsModal from '../../../modal_windows/InviteParticipantsModal';
import SendMessageModal from '../../../modal_windows/SendMessageModal';

const TestDashboardList = ({ students = [], testId, setActiveTab, isPrivate }) => {
  const { t } = useTranslation();
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [selectedGroupTag, setSelectedGroupTag] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // СТАН ДЛЯ СОРТУВАННЯ ТАБЛИЦІ
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

  // ФУНКЦІЯ ЗМІНИ СОРТУВАННЯ ПРИ КЛІКУ НА ЗАГОЛОВОК
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // ФІЛЬТРАЦІЯ ТА СОРТУВАННЯ
  const processedStudents = useMemo(() => {
    // 1. Спочатку фільтруємо по пошуку та групі
    let filtered = students.filter(student => {
      const matchesSearch = student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            student.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = selectedGroupTag === 'ALL' || student.groupTag === selectedGroupTag;
      return matchesSearch && matchesGroup;
    });

    // 2. Потім сортуємо
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        // Сортування по імені
        if (sortConfig.key === 'name') {
          const nameA = a.fullName || '';
          const nameB = b.fullName || '';
          return sortConfig.direction === 'asc' 
            ? nameA.localeCompare(nameB) 
            : nameB.localeCompare(nameA);
        }
        // Сортування по статусу
        if (sortConfig.key === 'status') {
          // Вага статусів для сортування: 1 - Зареєстрований, 2 - В процесі, 3 - Завершив
          const statusWeight = { 'COMPLETED': 3, 'IN_PROGRESS': 2, 'STARTED': 2, 'REGISTERED': 1 };
          const weightA = statusWeight[a.status] || 0;
          const weightB = statusWeight[b.status] || 0;
          return sortConfig.direction === 'asc' ? weightA - weightB : weightB - weightA;
        }
        // Сортування по результату (балах)
        if (sortConfig.key === 'result') {
          // Вираховуємо відсоток успішності. Якщо не завершив - рахуємо як -1
          const scoreA = (a.status === 'COMPLETED' && a.score !== null) ? (a.score / (a.totalMaxScore || 1)) : -1;
          const scoreB = (b.status === 'COMPLETED' && b.score !== null) ? (b.score / (b.totalMaxScore || 1)) : -1;
          return sortConfig.direction === 'asc' ? scoreA - scoreB : scoreB - scoreA;
        }
        return 0;
      });
    }

    return filtered;
  }, [students, searchQuery, selectedGroupTag, sortConfig]);

  const description = t('testDashboardList.desc.all', 'Тут ви можете переглянути зареєстрованих учасників та їхні результати тестування...');

  const getStatusInfo = (status) => {
    if (status === 'COMPLETED') {
      return { text: t('status.completed', 'Завершено'), className: 'text-completed' };
    }
    if (status === 'IN_PROGRESS' || status === 'STARTED') {
      return { text: t('status.inProgress', 'Проходить'), className: 'text-in-progress' };
    }
    return { text: t('status.registered', 'Зареєструвався'), className: 'text-registered' };
  };

  const getSortIcon = (key) => {
    const isActive = sortConfig.key === key;
    const isAsc = isActive && sortConfig.direction === 'asc';

    return (
      <FontAwesomeIcon 
        icon={faCaretDown} 
        className={`sort-triangle ${isActive ? 'sort-active' : ''} ${isAsc ? 'sort-up' : ''}`} 
      />
    );
  };

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

      {/* ТАБЛИЦЯ ІЗ СОРТУВАННЯМ У ЗАГОЛОВКАХ */}
      <div className="testDashboard__table-wrapper">
        <table className="testDashboard__table">
          <thead>
            <tr>
              <th onClick={() => requestSort('name')} className="sortable-header" style={{textAlign: 'left'}}>
                {t('table.name', 'Учасник')} {getSortIcon('name')}
              </th>
              <th>{t('table.group', 'Група')}</th>
              <th onClick={() => requestSort('status')} className="sortable-header">
                {t('table.status', 'Статус')} {getSortIcon('status')}
              </th>
              <th onClick={() => requestSort('result')} className="sortable-header">
                {t('table.result', 'Результат')} {getSortIcon('result')}
              </th>
              <th className="td-actions-head">{t('table.actions', 'Дії')}</th>
            </tr>
          </thead>
          <tbody>
            {processedStudents.length > 0 ? (
              processedStudents.map(student => {
                const isCompleted = student.status === 'COMPLETED';
                const statusData = getStatusInfo(student.status);

                return (
                  <tr key={student.userId}>
                    <td className="td-participant">
                      <span className="participant-name">
                        <Link to={`/profile/${student.userId}`} className="dashboard-profile-link" target="_blank">
                          {student.fullName}
                        </Link>
                      </span>
                      <span className="participant-email">{student.email}</span>
                    </td>
                    
                    <td style={{ fontSize: 'clamp(10px, 5vw, 16px)' }}>
                      {student.groupTag && student.groupTag !== '-' ? student.groupTag : '—'}
                    </td>
                    
                    <td>
                      <span className={`status-text ${statusData.className}`}>
                        {statusData.text}
                      </span>
                    </td>
                    
                    <td>
                      {isCompleted && student.score !== null && student.score !== undefined ? (
                        <Link to={`/testreview/${student.attemptId}`} className="dashboard-result-link">
                          <span className={`score-badge ${student.score > 0 ? 'score-good' : 'score-bad'}`}>
                            {student.score}/{student.totalMaxScore}
                          </span>
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    
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
        allStudents={processedStudents} 
      />
    </div>
  )
}

export default TestDashboardList;