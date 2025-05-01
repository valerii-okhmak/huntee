import React from 'react';
import TopTrial from '../components/trialTest/top/top';
import TrialMain from '../components/trialTest/main/main';

const TestPage = () => {
  return (
    <div className="page">
        <TopTrial />
        <div className="trialMain">
            <TrialMain />
        </div>
    </div>
  );
};

export default TestPage;