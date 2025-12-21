import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './TestCreation_SelectField.css'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const TestCreation_SelectField = ({ type, selectedOption, setSelectedOption, fieldName, fieldOptions, error}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuDateOpen, setMenuDateOpen] = useState(true);
  const [bigMenuOpen, setBigMenuOpen] = useState(false);
  const [classification, setClassification] = useState('none');
  const [timerType, setTimerType] = useState('none'); // none | fixed


  // Локальний стан для time (як раніше) — використовує переданий selectedOption
  const handleTimeChange = (typePart, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    let total = 0;
    const base = Number(selectedOption) || 0;

    if (typePart === 'hours') total = num * 3600 + Math.floor((base % 3600) / 60) * 60 + base % 60;
    if (typePart === 'minutes') total = Math.floor(base / 3600) * 3600 + num * 60 + base % 60;
    if (typePart === 'seconds') total = Math.floor(base / 3600) * 3600 + Math.floor((base % 3600) / 60) * 60 + num;

    setSelectedOption(total);
  };

  
  const [items, setItems] = useState([]);

  // Ініціалізація items з selectedOption (string JSON або масив)
  useEffect(() => {
    if (type !== 'list') return;
    if (!selectedOption) {
      setItems([]);
      return;
    }
    if (typeof selectedOption === 'string') {
      try {
        const parsed = JSON.parse(selectedOption);
        setItems(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        // якщо не валідний JSON — можна спробувати розділити по новому рядку як fallback
        if (typeof selectedOption === 'string' && selectedOption.trim()) {
          setItems([selectedOption]);
        } else {
          setItems([]);
        }
      }
    } else if (Array.isArray(selectedOption)) {
      setItems(selectedOption);
    } else {
      setItems([]);
    }
  }, [selectedOption, type]);

  // Оновлення зовнішнього selectedOption у вигляді JSON-рядка
  const pushItemsToParent = (newItems) => {
    try {
      setSelectedOption(JSON.stringify(newItems));
    } catch (err) {
      // fallback: передаємо масив напряму
      setSelectedOption(newItems);
    }
  }

  const updateItem = (index, value) => {
    const copy = [...items];
    copy[index] = value;
    setItems(copy);
    pushItemsToParent(copy);
  }

  const addItem = () => {
    const copy = [...items, ''];
    setItems(copy);
    pushItemsToParent(copy);
  }

  const removeItem = (index) => {
    const copy = [...items];
    copy.splice(index, 1);
    setItems(copy);
    pushItemsToParent(copy);
  }

  return (
    <div className={`select-field-tc ${menuOpen ? 'expanded' : ''} ${bigMenuOpen ? 'class-expanded' : ''} ${menuDateOpen && type === 'date' ? 'expanded-big' : ''}`}>
      {type === 'add' ?
        <label className="select-field-tc__label adding"><p>{fieldName}</p> <span>+</span></label>
        :
        <label className="select-field-tc__label">{fieldName}</label>
      }
      
      <div className='select-field-tc__right'>

        {type === 'input' && 
          <input
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            placeholder={fieldName}
            className={`select-field-tc__custom-input ${error ? 'error' : ''}`}   
          />
        }

        {type === 'select' && (
          <Select
            options={fieldOptions}
            value={selectedOption}
            onChange={setSelectedOption}
            isSearchable
            placeholder="Пошук"
            // Додаємо клас has-error безпосередньо селекту
            className={`select-field-tc__custom-select-container ${error ? 'has-error' : ''}`}
            classNamePrefix="select-field-tc__custom-select"
            onMenuOpen={() => setMenuOpen(true)}
            onMenuClose={() => setMenuOpen(false)}
          />
        )}

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

        {type === 'time' && (
          <div className="question-classification">

            <label className="question-classification__option">
              <input
                type="radio"
                name="timerType"
                value="none"
                checked={timerType === 'none'}
                onChange={() => {
                  setTimerType('none');
                  setSelectedOption(null);
                }}
              />
              <div className="question-classification__label">
                Без обмеження часу
              </div>
            </label>

            <label className="question-classification__option">
              <input
                type="radio"
                name="timerType"
                value="fixed"
                checked={timerType === 'fixed'}
                onChange={() => {
                  setTimerType('fixed');
                  setSelectedOption(0);
                }}
              />
              <div className="question-classification__label">
                Фіксований час
              </div>
            </label>

            {timerType === 'fixed' && (
              <div className="select-field-tc__time-input">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={String(Math.floor((Number(selectedOption) || 0) / 3600)).padStart(2, '0')}
                  onChange={(e) => handleTimeChange('hours', e.target.value)}
                />
                <span>:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={String(Math.floor(((Number(selectedOption) || 0) % 3600) / 60)).padStart(2, '0')}
                  onChange={(e) => handleTimeChange('minutes', e.target.value)}
                />
                <span>:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={String((Number(selectedOption) || 0) % 60).padStart(2, '0')}
                  onChange={(e) => handleTimeChange('seconds', e.target.value)}
                />
              </div>
            )}

          </div>
        )}

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

        {type === 'testtype' && (
          <div className="question-classification">
            <label className="question-classification__option">
              <input
                type="radio"
                name="testType"
                value="public"
                // Перевіряємо за значенням об'єкта або просто стейтом
                checked={selectedOption?.value === 'public'}
                onChange={() => setSelectedOption({ value: 'public', label: 'Публічний' })}
              />
              <div className="question-classification__label">
                Публічний
              </div>
            </label>

            <label className="question-classification__option">
              <input
                type="radio"
                name="testType"
                value="private"
                checked={selectedOption?.value === 'private'}
                onChange={() => setSelectedOption({ value: 'private', label: 'Приватний' })}
              />
              <div className="question-classification__label">
                Приватний
              </div>
            </label>
            
            <p style={{ fontSize: '12px', color: '#666' }}>
              {selectedOption?.value === 'public' 
                ? "Доступний усім користувачам платформи" 
                : "Доступний лише за прямим посиланням або інвайтом"}
            </p>
          </div>
        )}

        {type === 'list' && (
          <div className="responsibilities-list">

            {items.map((it, idx) => (
              <div key={idx} className="responsibilities-list__row">
                <input
                  type="text"
                  className="responsibilities-list__input"
                  placeholder={`Обов'язок #${idx + 1}`}
                  value={it}
                  onChange={(e) => updateItem(idx, e.target.value)}
                />
                <div className="responsibilities-list__controls">
                  {items.length > 0 && (
                    <button
                      type="button"
                      className="responsibilities-list__remove"
                      title="Видалити"
                      onClick={() => removeItem(idx)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="responsibilities-list__add"
              onClick={addItem}
            >
              Додати обов'язок <span>+</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default TestCreation_SelectField;
