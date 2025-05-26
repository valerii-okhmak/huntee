import React from 'react';
import TrialMain from '../components/trialTest/main/TrialTest';
import CustomTitle from '../components/custom_title/CustomTitle';

const TestPage = () => {

  const object = {
    logo: null,
    line: true,
    strong: 'Дізнайся як проходять тести!',
    p: null
  }

  return (
    <div className="page">
        <CustomTitle title='Пройди пробне тестування' data={object} />
        <div className="trialMain">
            <TrialMain />
        </div>
    </div>
  );
};

export default TestPage;