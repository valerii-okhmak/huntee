import React from 'react';
import './ViewingTests.css';
import SearchBar from '../SearchBar/SearchBar';
import AddTestsButton from '../AddTestsButton/AddTestsButton';
import TestsList from '../TestsList/TestsList';
import FieldsFilter from '../Filters/FieldsFilter/FieldsFilter';
import OurDataFilter from '../Filters/OurDataFilter/OurDataFilter';

const ViewingTests = () => {
  return (
    <div className="viewing-tests-page container">
      <div className="viewing-tests-left-side">
        <div className="viewing-tests-search-bar-container">
          <SearchBar />
        </div>
        <div className="viewing-tests-tests-list-section">
          <TestsList />
        </div>
      </div>
      <div className="viewing-tests-right-side">
        <div className="viewing-tests-add-test-button-container">
          <AddTestsButton />
        </div>
        <div className="viewing-tests-filters-section">
          <OurDataFilter />
          <FieldsFilter />
        </div>
      </div>
    </div>
  );
};

export default ViewingTests;
