import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ selectedLocations, setSelectedLocations }) => {
  const [hidden, setHidden] = useState(false);

  const toggleFilter = () => {
    setHidden(!hidden);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedLocations([...selectedLocations, value]);
    } else {
      setSelectedLocations(selectedLocations.filter(loc => loc !== value));
    }
  };

  return (
    <div className='filter'>
      <div className='filer_name'>
        <h2 className='filter_title'>ЛОКАЦІЯ</h2>
        <div className='filter_action' onClick={toggleFilter}>
          <div className={`filter_button ${hidden ? 'plus' : ''}`}></div>
        </div>
      </div>

      {!hidden && (
        <div className='filter_section'>
          {['Львів', 'Тернопіль', 'Івано-Франківськ'].map((loc, i) => (
          <label className='custom-checkbox' key={i}>
            <input
              type='checkbox'
              className='custom-input'
              value={loc}
              id={`check1_${i}`}
              onChange={handleCheckboxChange}
              checked={selectedLocations.includes(loc)}
            />
            <span className='checkbox-square'></span>
            {loc}
          </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
