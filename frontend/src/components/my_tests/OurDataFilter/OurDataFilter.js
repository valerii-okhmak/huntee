import React, { useState } from 'react';
import './OurDataFilter.css';

const OurDataFilter = ({ selected, onSelect, stats }) => {
  const [hidden, setHidden] = useState(false);

  const toggleFilter = () => {
    setHidden(!hidden);
  };

  // Формуємо опції на основі отриманого об'єкта stats
  const options = [
    { label: 'Всі тести', count: stats?.total || 0 }, 
    { label: 'Активні тести', count: stats?.active || 0 }, 
    { label: 'Заплановані тести', count: stats?.scheduled || 0 },
    { label: 'Завершені тести', count: stats?.closed || 0 },
  ];

  const handleSelect = (label) => {
    // Якщо клікнули на вже обраний фільтр — скидаємо до "Всі тести"
    if (selected === label) {
      onSelect('Всі тести');
    } else {
      onSelect(label);
    }
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