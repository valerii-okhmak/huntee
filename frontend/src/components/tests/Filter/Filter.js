import React, { useState, useMemo } from 'react';
import './Filter.css';

const Filter = ({ title, allTests, propertyToFilter, selectedValues, setSelectedValues }) => {
  const [hidden, setHidden] = useState(false);

  // useMemo обчислює унікальні значення лише один раз,
  // або коли змінюється 'allTests'
  const uniqueValues = useMemo(() => {
    // 1. Отримуємо всі значення з потрібного поля (напр., test['location'])
    const allValues = allTests.map(test => test[propertyToFilter]);
    // 2. new Set() залишає тільки унікальні
    // 3. [... ] перетворює Set назад у масив і сортує
    return [...new Set(allValues)].sort();
  }, [allTests, propertyToFilter]); 

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedValues([...selectedValues, value]);
    } else {
      setSelectedValues(selectedValues.filter(val => val !== value));
    }
  };

  const toggleFilter = () => {
    setHidden(!hidden);
  };

  return (
    <div className='filter'>
      <div className='filer_name'>
        <h2 className='filter_title'>{title}</h2>
        <div className='filter_action' onClick={toggleFilter}>
          <div className={`filter_button ${hidden ? 'plus' : ''}`}></div>
        </div>
      </div>

      {!hidden && (
        <div className='filter_section'>
          {/* Мапимо наш динамічно створений масив унікальних значень */}
          {uniqueValues.map((value, i) => (
            <label className='custom-checkbox' key={i}>
              <input
                type='checkbox'
                className='custom-input'
                value={value}
                id={`check_${propertyToFilter}_${i}`} // Робимо ID унікальним
                onChange={handleCheckboxChange}
                checked={selectedValues.includes(value)}
              />
              <span className='checkbox-square'></span>
              {value}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;