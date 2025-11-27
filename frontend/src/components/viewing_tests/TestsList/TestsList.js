import React from 'react';
import './TestsList.css';
import TestCard from '../TestCard/TestCard';

const TestsList = () => {
  return (
    <div className="tests-list-block">
      <TestCard title='JUNIOR DATA SCIENTIST' type='Data Science' location='Lviv' date='21.03.2025' time='18:00' link='/' isActive={true}/>
      <TestCard title='JUNIOR DATA SCIENTIST' type='Data Science' location='Lviv' date='21.03.2025' time='18:00' link='/' isActive={false}/>
      <TestCard title='JUNIOR DATA SCIENTIST' type='Data Science' location='Lviv' date='21.03.2025' time='18:00' link='/' isActive={true}/>
      <TestCard title='JUNIOR DATA SCIENTIST' type='Data Science' location='Lviv' date='21.03.2025' time='18:00' link='/' isActive={false}/>
      <TestCard title='JUNIOR DATA SCIENTIST' type='Data Science' location='Lviv' date='21.03.2025' time='18:00' link='/' isActive={true}/>
      <TestCard title='JUNIOR DATA SCIENTIST' type='Data Science' location='Lviv' date='21.03.2025' time='18:00' link='/' isActive={false}/>
    </div>
  );
};

export default TestsList;
