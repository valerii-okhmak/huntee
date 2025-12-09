import React from 'react';
import Filter from '../Filter/Filter';
import './Filters.css';

const Filters = ({
  allTests,
  selectedLocations, setSelectedLocations,
  selectedSpheres, setSelectedSpheres,
  selectedTimes, setSelectedTimes
}) => {
  return (
    <div className='filters'>
      <Filter
        title="ЛОКАЦІЯ"
        allTests={allTests}
        propertyToFilter="location" 
        selectedValues={selectedLocations}
        setSelectedValues={setSelectedLocations}
      />
      <Filter
        title="СФЕРА"
        allTests={allTests}
        propertyToFilter="type"
        selectedValues={selectedSpheres}
        setSelectedValues={setSelectedSpheres}
      />
      <Filter
        title="ЧАС"
        allTests={allTests}
        propertyToFilter="time" 
        selectedValues={selectedTimes}
        setSelectedValues={setSelectedTimes}
      />
    </div>
  );
}

export default Filters;