import React, { useState } from 'react';
import './OurDataFilter.css';

const OurDataFilter = () => {
  const [hidden, setHidden] = useState(false);
  const [selected, setSelected] = useState(null); // Зберігаємо один вибраний варіант

  const toggleFilter = () => {
    setHidden(!hidden);
  };

  // Варіанти з цифрами
  const options = [
    { label: 'Всі тести', count: 12 },
    { label: 'Активні тести', count: 8 },
    { label: 'Завершені тести', count: 5 },
    { label: 'Файли', count: 3 },
    { label: 'Банка запитань', count: 9 },
    { label: 'Мої пройдені тести', count: 7 }
  ];

  const handleSelect = (loc) => {
    setSelected(selected === loc ? null : loc); // якщо той самий — знімаємо
  };

  return (
    <div className='ourdata_filter'>
      <div className='ourdata_filter_name'>
        <h2 className='ourdata_filter_title'>ЛОКАЦІЯ</h2>
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
