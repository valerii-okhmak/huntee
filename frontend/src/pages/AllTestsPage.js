import React from 'react';
import Filters from '../components/tests/Filters/Filters';
import TestsBlock from '../components/tests/TestsBlock/TestsBlock';
import CustomTitle from '../components/custom_title/CustomTitle';

const AllTestsPage = () => {

  const object = {
    logo: null,
    line: true,
    strong: 'Вакансії для початківців в IT',
    p: 'Обери найкращу сферу для себе та зроби перший крок!'
  }

  return (

    <div className="page">
      <CustomTitle title='Приєднуйся!' data={object} />
      <div className='testsMain container'>
        <Filters />
        <TestsBlock />
      </div>
    </div>
  )
}

export default AllTestsPage