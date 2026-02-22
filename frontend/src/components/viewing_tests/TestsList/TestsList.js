import React from 'react';
import './TestsList.css';
import TestCard from '../TestCard/TestCard';

const TestsList = ({ tests, onDeleteTest }) => {
  if (!tests || tests.length === 0) {
      return <div className="no-tests">Тестів не знайдено</div>;
  }

  return (
    <div className="tests-list-block">
      {tests.map(test => (
        <TestCard 
            key={test.id}
            id={test.id}
            title={test.title}
            type={test.type}
            location={test.location}
            date={test.date}
            time={test.time}
            link={test.link}
            candidatesCount={test.candidatesCount}
            onDeleteSuccess={onDeleteTest}
            status={test.status}
        />
      ))}
    </div>
  );
};

export default TestsList;