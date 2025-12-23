import React, { useState } from 'react';
import './FieldsFilter.css';

const FieldsFilter = ({ selected, onSelect, spheres }) => {
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
          {spheres.map((sphere, i) => (
            <label className='custom-checkbox' key={i}>
              <input
                type='checkbox'
                className='custom-input'
                value={sphere.name}
                id={`check_field_${i}`}
                checked={selected.includes(sphere.name)}
                onChange={handleCheckboxChange}
              />
              <span className='checkbox-square'></span>
                <span className='fields_checkbox-label'>{sphere.name}</span>
                <span className='fields_checkbox-count'>
                  ({sphere.count})
                </span>
            </label>
          ))}
          {spheres.length === 0 && (
            <div style={{ fontSize: '12px', opacity: 0.5, padding: '5px 0' }}>
              Немає доступних сфер
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FieldsFilter;