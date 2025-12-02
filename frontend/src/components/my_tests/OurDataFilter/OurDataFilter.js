import React, { useState } from 'react';
import './OurDataFilter.css';

const OurDataFilter = ({ selected, onSelect, totalCount }) => {
  const [hidden, setHidden] = useState(false);

  const toggleFilter = () => {
    setHidden(!hidden);
  };

  const options = [
    { label: 'Всі тести', count: totalCount || 0 }, 
    { label: 'Активні тести', count: 0 }, 
    { label: 'Завершені тести', count: 0 },
  ];

  const handleSelect = (label) => {
    onSelect(label); 
  };

  return (
    <div className='ourdata_filter'>
      <div className='ourdata_filter_name'>
        <h2 className='ourdata_filter_title'>НАШІ ДАНІ</h2>
        <div className='ourdata_filter_action' onClick={toggleFilter}>
          <div className={`ourdata_filter_button ${hidden ? 'plus' : ''}`}></div>
        </div>
      </div>

      {!hidden && (
        <div className='ourdata_filter_section'>
          {options.map((opt, i) => (
          <label className='custom-checkbox' key={i}>
            <input
              type='checkbox' 
              className='custom-input'
              checked={selected === opt.label}
              onChange={() => handleSelect(opt.label)}
            />
            <span className='checkbox-square'></span>
            <span className='ourdata_checkbox-label'>{opt.label}</span>
            <span className='ourdata_checkbox-count'>({opt.count})</span>
          </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default OurDataFilter;