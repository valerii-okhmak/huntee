import React from 'react';
import './TestsList.css';
import TestCard from '../TestCard/TestCard';

const TestsList = ({ tests }) => {
  if (!tests || tests.length === 0) {
      return <div className="no-tests">Тестів не знайдено</div>;
  }

  return (
    <div className="tests-list-block">
      {tests.map(test => (
        <TestCard 
            key={test.id}
            title={test.title}
            type={test.type}
            location={test.location}
            date={test.date}
            time={test.time}
            link={test.link}
            isActive={test.candidatesCount > 0} 
            candidatesCount={test.candidatesCount}
        />
      ))}
    </div>
  );
};

export default TestsList;