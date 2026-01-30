import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import './TestCreation_SelectField.css'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import 'moment/locale/uk';
import moment from 'moment';

const TestCreation_SelectField = ({ type, selectedOption, setSelectedOption, fieldName, fieldOptions, error}) => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuDateOpen, setMenuDateOpen] = useState(true);
  const [bigMenuOpen, setBigMenuOpen] = useState(false);
  const [classification, setClassification] = useState('none');
  const [timerType, setTimerType] = useState('none');

  useEffect(() => {
    moment.locale(i18n.language === 'uk' ? 'uk' : 'en');
  }, [i18n.language]);

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

  const pushItemsToParent = (newItems) => {
    try {
      setSelectedOption(JSON.stringify(newItems));
    } catch (err) {
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
            placeholder={t('testCreationSelectField.search')}
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
              placeholder: t('testCreationSelectField.datePlaceholder'),
              onFocus: () => setMenuDateOpen(true),
              className: `select-field-tc__custom-input ${error ? 'error' : ''}` 
            }}
            dateFormat="DD.MM.YYYY"
            timeFormat="HH:mm"
            locale={i18n.language === 'uk' ? 'uk' : 'en'}
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
                {t('testCreationSelectField.time.none')}
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
                {t('testCreationSelectField.time.fixed')}
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
              <div className="question-classification__label">{t('testCreationSelectField.class.none')}</div>
            </label>

            <label className="question-classification__option">
              <input
                type="radio"
                name="classification"
                value="custom"
                checked={classification === 'custom'}
                onChange={() => setClassification('custom')}
              />
              <div className="question-classification__label">{t('testCreationSelectField.class.custom')}</div>
            </label>

            {classification === 'custom' && (
              <div className="question-classification__select">
                <Select
                  isMulti
                  options={fieldOptions}
                  value={selectedOption}
                  onChange={setSelectedOption}
                  placeholder={t('testCreationSelectField.search')}
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
                checked={selectedOption?.value === 'public'}
                onChange={() => setSelectedOption({ value: 'public', label: t('testCreationSelectField.testType.public') })}
              />
              <div className="question-classification__label">
                {t('testCreationSelectField.testType.public')}
              </div>
            </label>

            <label className="question-classification__option">
              <input
                type="radio"
                name="testType"
                value="private"
                checked={selectedOption?.value === 'private'}
                onChange={() => setSelectedOption({ value: 'private', label: t('testCreationSelectField.testType.private') })}
              />
              <div className="question-classification__label">
                 {t('testCreationSelectField.testType.private')}
              </div>
            </label>
            
            <p style={{ fontSize: '12px', color: '#666' }}>
              {selectedOption?.value === 'public' 
                ? t('testCreationSelectField.testType.publicDesc') 
                : t('testCreationSelectField.testType.privateDesc')}
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
                  placeholder={t('testCreationSelectField.list.placeholder', { number: idx + 1 })}
                  value={it}
                  onChange={(e) => updateItem(idx, e.target.value)}
                />
                <div className="responsibilities-list__controls">
                  {items.length > 0 && (
                    <button
                      type="button"
                      className="responsibilities-list__remove"
                      title={t('testCreationSelectField.list.remove')}
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
              {t('testCreationSelectField.list.add')} <span>+</span>
            </button>
          </div>
        )}

        {type === 'testquestionssorting' && (
          <div className="question-classification">
            <label className="question-classification__option">
              <input
                type="radio"
                name="testQuestionsSorting"
                value="fixed"
                checked={selectedOption?.value === 'fixed'}
                onChange={() => setSelectedOption({ value: 'fixed', label: t('testCreationSelectField.sorting.fixed') })}
              />
              <div className="question-classification__label">
                 {t('testCreationSelectField.sorting.fixed')}
              </div>
            </label>

            <label className="question-classification__option">
              <input
                type="radio"
                name="testQuestionsSorting"
                value="random"
                checked={selectedOption?.value === 'random'}
                onChange={() => setSelectedOption({ value: 'random', label: t('testCreationSelectField.sorting.random') })}
              />
              <div className="question-classification__label">
                 {t('testCreationSelectField.sorting.random')}
              </div>
            </label>
            
            <p style={{ fontSize: '12px', color: '#666' }}>
              {selectedOption?.value === 'fixed' 
                ? t('testCreationSelectField.sorting.questionsFixedDesc')
                : t('testCreationSelectField.sorting.questionsRandomDesc')}
            </p>
          </div>
        )}

        {type === 'testanswerssorting' && (
          <div className="question-classification">
            <label className="question-classification__option">
              <input
                type="radio"
                name="testAnswersSorting"
                value="fixed"
                checked={selectedOption?.value === 'fixed'}
                onChange={() => setSelectedOption({ value: 'fixed', label: t('testCreationSelectField.sorting.fixed') })}
              />
              <div className="question-classification__label">
                 {t('testCreationSelectField.sorting.fixed')}
              </div>
            </label>

            <label className="question-classification__option">
              <input
                type="radio"
                name="testAnswersSorting"
                value="random"
                checked={selectedOption?.value === 'random'}
                onChange={() => setSelectedOption({ value: 'random', label: t('testCreationSelectField.sorting.random') })}
              />
              <div className="question-classification__label">
                {t('testCreationSelectField.sorting.random')}
              </div>
            </label>
            
            <p style={{ fontSize: '12px', color: '#666' }}>
              {selectedOption?.value === 'fixed' 
                ? t('testCreationSelectField.sorting.answersFixedDesc')
                : t('testCreationSelectField.sorting.answersRandomDesc')}
            </p>
          </div>
        )}

        {type === 'showresults' && (
          <div className="question-classification">
            <label className="question-classification__option">
              <input
                type="radio"
                name="showResults"
                value="yes"
                checked={selectedOption?.value === 'yes'}
                onChange={() => setSelectedOption({ value: 'yes', label: t('testCreationSelectField.showResults.yes') })}
              />
              <div className="question-classification__label">
                 {t('testCreationSelectField.showResults.yes')}
              </div>
            </label>

            <label className="question-classification__option">
              <input
                type="radio"
                name="showResults"
                value="no"
                checked={selectedOption?.value === 'no'}
                onChange={() => setSelectedOption({ value: 'no', label: t('testCreationSelectField.showResults.no') })}
              />
              <div className="question-classification__label">
                {t('testCreationSelectField.showResults.no')}
              </div>
            </label>

            <p style={{ fontSize: '12px', color: '#666' }}>
              {selectedOption?.value === 'yes'
                ? t('testCreationSelectField.showResults.yesDesc')
                : t('testCreationSelectField.showResults.noDesc')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestCreation_SelectField;