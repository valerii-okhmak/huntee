import React from 'react';
import TestsTop from '../components/tests/TestsTop/TestsTop';
import Filters from '../components/tests/Filters/Filters';
import TestsBlock from '../components/tests/TestsBlock/TestsBlock';

const AllTestsPage = () => {
  return (
    <div className="page">
      <TestsTop />
      <div className='testsMain container'>
        <Filters />
        <TestsBlock />
      </div>
    </div>
  )
}

export default AllTestsPage