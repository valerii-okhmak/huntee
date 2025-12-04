import React from 'react'
import './DashboardTabNavigation.css'

const DashboardTabNavigation = ({ activeTab, setActiveTab }) => {
    const tabNames = ['registered', 'results', 'analytics'];

    const getTabLabel = (name) => {
        switch (name) {
          case 'registered': return 'Зареєстровані';
          case 'results': return 'Результати';
          case 'analytics': return 'Аналітика';
          default: return '';
        }
    };

  return (
    <nav className="container testDashboard__tabs-nav">
      {tabNames.map((tab) => (
        <button
          key={tab}
          className={activeTab === tab ? 'testDashboard__tabs-active' : ''}
          onClick={() => setActiveTab(tab)}
        >
          {getTabLabel(tab)}
        </button>
      ))}
    </nav>
  )
}

export default DashboardTabNavigation