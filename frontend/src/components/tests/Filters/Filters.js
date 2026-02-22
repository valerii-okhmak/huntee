import React from 'react';
import { useTranslation } from 'react-i18next';
import Filter from '../Filter/Filter';
import './Filters.css';

const Filters = ({
  allTests,
  selectedLocations, setSelectedLocations,
  selectedSpheres, setSelectedSpheres,
}) => {
  const { t } = useTranslation();

  return (
    <div className='filters'>
      <Filter
        title={t('filters.location')}
        allTests={allTests}
        propertyToFilter="location" 
        selectedValues={selectedLocations}
        setSelectedValues={setSelectedLocations}
      />
      <Filter
        title={t('filters.sphere')}
        allTests={allTests}
        propertyToFilter="type"
        selectedValues={selectedSpheres}
        setSelectedValues={setSelectedSpheres}
      />
    </div>
  );
}

export default Filters;