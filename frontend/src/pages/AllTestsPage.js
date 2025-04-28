import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import TestsTop from '../components/tests/TestsTop/TestsTop';
import Filters from '../components/tests/Filters/Filters';
import TestsBlock from '../components/tests/TestsBlock/TestsBlock';

const AllTestsPage = () => {
  return (
    <div className="page">
      <Header />

      <TestsTop />
      <div className='testsMain container'>
        <Filters />
        <TestsBlock />
      </div>

      <Footer />
    </div>
  )
}

export default AllTestsPage