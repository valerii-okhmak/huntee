import React from 'react'
import CustomTitle from '../components/custom_title/CustomTitle';
import TestCreation from '../components/test_creation/TestCreation';

const TestCreationPage = () => {

  const object = {
    logo: null,
    line: true,
    strong: 'Ми допоможемо знайти якісних працівників!',
    p: null
  }

  return (
    <div className="page">
        <CustomTitle title='Test Creation' data={object} />
        <TestCreation/>
    </div>
  )
}

export default TestCreationPage