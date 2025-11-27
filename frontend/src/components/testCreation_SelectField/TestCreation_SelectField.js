import React, { useState } from 'react';
import Select from 'react-select';
import './TestCreation_SelectField.css'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';

const TestCreation_SelectField = ({ type, selectedOption, setSelectedOption, fieldName, fieldOptions }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuDateOpen, setMenuDateOpen] = useState(true);
  const [bigMenuOpen, setBigMenuOpen] = useState(false);
  const [classification, setClassification] = useState('none');

  const handleTimeChange = (type, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    let total = 0;

    if (type === 'hours') total = num * 3600 + Math.floor((selectedOption % 3600) / 60) * 60 + selectedOption % 60;
    if (type === 'minutes') total = Math.floor(selectedOption / 3600) * 3600 + num * 60 + selectedOption % 60;
    if (type === 'seconds') total = Math.floor(selectedOption / 3600) * 3600 + Math.floor((selectedOption % 3600) / 60) * 60 + num;

    setSelectedOption(total);
  };

    return (
        <div className={`select-field-tc ${menuOpen ? 'expanded' : ''} ${bigMenuOpen ? 'class-expanded' : ''} ${menuDateOpen && type === 'date' ? 'expanded-big' : ''}`}>
          {type === 'add' ?
            <label className="select-field-tc__label adding"><p>{fieldName}</p> <span>+</span></label>
            :
            <label className="select-field-tc__label">{fieldName}</label>
          }
          
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

              {type === 'textarea' && 
                
                <textarea
                  value={selectedOption || ''}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  placeholder={fieldName}
                  className="select-field-tc__custom-textarea"
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
                    value={String(Math.floor(selectedOption / 3600)).padStart(2, '0')}
                    onChange={(e) => handleTimeChange('hours', e.target.value)}
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={String(Math.floor((selectedOption % 3600) / 60)).padStart(2, '0')}
                    onChange={(e) => handleTimeChange('minutes', e.target.value)}
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={String(selectedOption % 60).padStart(2, '0')}
                    onChange={(e) => handleTimeChange('seconds', e.target.value)}
                  />
                </div>
              }

              {type === 'class' && 
                <div className='question-classification'>
                  <label className="question-classification__option">
                    <input
                      type="radio"
                      name="classification"
                      value="none"
                      checked={classification === 'none'}
                      onChange={() => setClassification('none')}
                    />
                    <div className="question-classification__label">Не класифікувати питання</div>
                    
                  </label>

                  <label className="question-classification__option">
                    <input
                      type="radio"
                      name="classification"
                      value="custom"
                      checked={classification === 'custom'}
                      onChange={() => setClassification('custom')}
                    />
                    <div className="question-classification__label">Додати класи для тесту</div>
                    
                  </label>

                  {classification === 'custom' && (
                    <div className="question-classification__select">
                      <Select
                        isMulti
                        options={fieldOptions}
                        value={selectedOption}
                        onChange={setSelectedOption}
                        placeholder="Пошук"
                        className='question-classification__select'
                        classNamePrefix="select-field-tc__custom-select"
                        onMenuOpen={() => setBigMenuOpen(true)}
                        onMenuClose={() => setBigMenuOpen(false)}
                      />
                    </div>
                  )}
                </div>
              }

            </div>
          
        </div>
      );
}

export default TestCreation_SelectField