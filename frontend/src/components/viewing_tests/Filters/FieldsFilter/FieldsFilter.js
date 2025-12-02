import React, { useState } from 'react';
import './FieldsFilter.css';

const FieldsFilter = ({ selected, onSelect }) => {
  const [hidden, setHidden] = useState(false);

  const toggleFilter = () => {
    setHidden(!hidden);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
        onSelect([...selected, value]);
    } else {
        onSelect(selected.filter(item => item !== value));
    }
  };

  return (
    <div className='fields_filter'>
      <div className='fields_filter_name'>
        <h2 className='fields_filter_title'>СФЕРИ</h2>
        <div className='fields_filter_action' onClick={toggleFilter}>
          <div className={`fields_filter_button ${hidden ? 'plus' : ''}`}></div>
        </div>
      </div>

      {!hidden && (
        <div className='fields_filter_section'>
          {['Всі', 'Data Science', 'Frontend','Backend', 'QA', 'DevOps'].map((loc, i) => (
          <label className='custom-checkbox' key={i}>
            <input
              type='checkbox'
              className='custom-input'
              value={loc}
              id={`check_field_${i}`}
              checked={selected.includes(loc)}
              onChange={handleCheckboxChange}
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