import React from 'react';
import { useLocation } from 'react-router-dom';
import TestCreationStartContainer from '../components/testCreationStartContainer/TestCreationStartContainer';

const TestCreationStartPage = () => {
  const location = useLocation();

  const mode = location.state?.mode ?? 'create';
  const testId = location.state?.testId ?? null;

  return (
    <div className="page">
      <TestCreationStartContainer mode={mode} testId={testId} />
    </div>
  );
};

export default TestCreationStartPage;
