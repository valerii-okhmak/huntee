import React from 'react';
import { useTranslation } from 'react-i18next';
import './DashboardTabNavigation.css';

const DashboardTabNavigation = ({ activeTab, setActiveTab }) => {
    const { t } = useTranslation();
    const tabNames = ['registered', 'results', 'analytics'];

    const getTabLabel = (name) => {
        switch (name) {
          case 'registered': return t('dashboardTabNavigation.registered');
          case 'results': return t('dashboardTabNavigation.results');
          case 'analytics': return t('dashboardTabNavigation.analytics');
          default: return '';
        }
    };

  return (
    <nav className="testDashboard__tabs-nav">
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

export default DashboardTabNavigation;