import React, { useState } from 'react';
import './FieldsFilter.css';

const FieldsFilter = () => {
  const [hidden, setHidden] = useState(false);

  const toggleFilter = () => {
    setHidden(!hidden);
  };

  return (
    <div className='fields_filter'>
      <div className='fields_filter_name'>
        <h2 className='fields_filter_title'>ЛОКАЦІЯ</h2>
        <div className='fields_filter_action' onClick={toggleFilter}>
          <div className={`fields_filter_button ${hidden ? 'plus' : ''}`}></div>
        </div>
      </div>

      {!hidden && (
        <div className='fields_filter_section'>
          {['Всі', 'Data Science', 'Frontend','Backend'].map((loc, i) => (
          <label className='custom-checkbox' key={i}>
            <input
              type='checkbox'
              className='custom-input'
              value={loc}
              id={`check1_${i}`}
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

export default FieldsFilter;
