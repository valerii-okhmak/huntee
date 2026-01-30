import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './OurDataFilter.css';

const OurDataFilter = ({ selected, onSelect, stats }) => {
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);

  const toggleFilter = () => {
    setHidden(!hidden);
  };

  const options = [
    { label: t('ourDataFilter.all'), count: stats?.total || 0, value: 'Всі тести' }, 
    { label: t('ourDataFilter.active'), count: stats?.active || 0, value: 'Активні тести' }, 
    { label: t('ourDataFilter.scheduled'), count: stats?.scheduled || 0, value: 'Заплановані тести' },
    { label: t('ourDataFilter.closed'), count: stats?.closed || 0, value: 'Завершені тести' },
  ];

  const handleSelect = (option) => {
    if (selected === option.value) {
      onSelect('Всі тести'); 
    } else {
      onSelect(option.value);
    }
  };

  return (
    <div className='ourdata_filter'>
      <div className='ourdata_filter_name'>
        <h2 className='ourdata_filter_title'>{t('ourDataFilter.title')}</h2>
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
                checked={selected === opt.value}
                onChange={() => handleSelect(opt)}
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