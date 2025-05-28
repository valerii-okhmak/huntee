import React from 'react';
import Filters from '../components/tests/Filters/Filters';
import TestsBlock from '../components/tests/TestsBlock/TestsBlock';
import CustomTitle from '../components/custom_title/CustomTitle';
import { useState } from 'react';

const AllTestsPage = () => {

  const object = {
    logo: null,
    line: true,
    strong: 'Вакансії для початківців в IT',
    p: 'Обери найкращу сферу для себе та зроби перший крок!'
  }

  const allTests = [
  {
    id: 1,
    title: 'JUNIOR DATA SCIENTIST',
    type: 'Data Science',
    location: 'Львів',
    date: '21.03.2025',
    time: '18:00',
    link: '/testpage',
  },
  {
    id: 2,
    title: 'ML Specialist',
    type: 'AI',
    location: 'Тернопіль',
    date: '22.03.2025',
    time: '14:00',
    link: '/testpage',
  },
];

  const [selectedLocations, setSelectedLocations] = useState([]);

  return (
    <div className="page">
      <CustomTitle title='Приєднуйся!' data={object} />
      <div className='testsMain container'>
        <Filters 
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
        />
        <TestsBlock 
          selectedLocations={selectedLocations}
          allTests={allTests}
        />

      </div>
    </div>
  )
}

export default AllTestsPage