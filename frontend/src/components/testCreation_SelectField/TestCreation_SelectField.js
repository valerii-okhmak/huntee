import React, { useState } from 'react';
import Select from 'react-select';
import './TestCreation_SelectField.css'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';

const TestCreation_SelectField = ({ type, selectedOption, setSelectedOption, fieldName, fieldOptions }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuDateOpen, setMenuDateOpen] = useState(true);

  const handleTimeChange = (type, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    let total = 0;

    if (type === 'hours') total = num * 3600 + Math.floor((selectedOption % 3600) / 60) * 60 + selectedOption % 60;
    if (type === 'minutes') total = Math.floor(selectedOption / 3600) * 3600 + num * 60 + selectedOption % 60;
    if (type === 'seconds') total = Math.floor(selectedOption / 3600) * 3600 + Math.floor((selectedOption % 3600) / 60) * 60 + num;

    setSelectedOption(total);
  };

    return (
        <div className={`select-field-tc ${menuOpen ? 'expanded' : ''} ${menuDateOpen && type === 'date' ? 'expanded-big' : ''}`}>
          <label className="select-field-tc__label">{fieldName}</label>
          <div className='select-field-tc__right'>
            {type === 'select' && 
            
              <Select
                options={fieldOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                isSearchable
                placeholder="Пошук"
                classNamePrefix="select-field-tc__custom-select"  
                onMenuOpen={() => setMenuOpen(true)}
                onMenuClose={() => setMenuOpen(false)}
              />
            }

            {type === 'date' &&
              <Datetime
              value={selectedOption}
              onChange={setSelectedOption}
              inputProps={{
                placeholder: 'Оберіть дату та час',
                onFocus: () => setMenuDateOpen(true),
              }}
              dateFormat="DD.MM.YYYY"
              timeFormat="HH:mm"
              open={true}
            />
            }

            {type === 'time' &&
              <div className="select-field-tc__time-input">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={Math.floor(selectedOption / 3600)}
                  onChange={(e) => handleTimeChange('hours', e.target.value)}
                />
                <span>:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={Math.floor((selectedOption % 3600) / 60)}
                  onChange={(e) => handleTimeChange('minutes', e.target.value)}
                />
                <span>:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={selectedOption % 60}
                  onChange={(e) => handleTimeChange('seconds', e.target.value)}
                />
              </div>
            }
          </div>
          
        </div>
      );
}

export default TestCreation_SelectField