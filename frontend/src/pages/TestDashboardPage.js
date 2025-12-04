import React, { useState } from 'react'
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader';
import DashboardTabNavigation from '../components/test_dashboard/DashboardTabNavigation/DashboardTabNavigation';
import TestDashboardList from '../components/test_dashboard/tabs/TestDashboardList/TestDashboardList';
import TestDashboardAnalytics from '../components/test_dashboard/tabs/TestDashboardAnalytics/TestDashboardAnalytics';

const studentsData = [
    { id: 1, name: 'Петрикович Антоніна Юріївна', score: 80, email: 'petrik@test.com' },
    { id: 2, name: 'Стеценко Олег Іванович', score: 30, email: 'stetsenko@test.com' },
    { id: 3, name: 'Коваленко Марія Вікторівна', score: null, email: 'kovalenko@test.com' },
];

const TestDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('results');

    const renderContent = () => {
        switch (activeTab) {
          case 'analytics':
            return <TestDashboardAnalytics />;
          
          case 'registered':
          case 'results':
            return (
              <TestDashboardList 
                activeTab={activeTab} 
                students={studentsData} 
                setActiveTab={setActiveTab} 
              />
            );
          default:
            return null;
        }
    };

    return (
        <div className='page'>
            <GeneralTestInfoHeader
                field="Data Science"
                title="JUNIOR DATA SCIENTIST"
                location="Lviv"
                date="21.03.2025"
                time="18:00"
            />

            <DashboardTabNavigation 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
            />

            {renderContent()}
        </div>
    )
}

export default TestDashboardPage