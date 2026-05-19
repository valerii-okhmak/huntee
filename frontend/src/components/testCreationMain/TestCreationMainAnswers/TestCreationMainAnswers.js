import React from "react";
import { useTranslation } from 'react-i18next';
import './TestCreationMainAnswers.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

const TestCreationMainAnswers = ({
  selectedType,
  comment, setComment,
  errors, 

  options,
  updateOption,
  addOption,
  removeOption,
  minBase,

  regularCorrect,
  pickRegularCorrect,

  multipleCorrect,
  toggleMultipleCorrect,

  openExpectedEnabled,
  setOpenExpectedEnabled,
  openExpectedText,
  setOpenExpectedText,

  codeLanguage, setCodeLanguage,
  codeMethodName, setCodeMethodName,
  codeTemplate, setCodeTemplate,
  codeTestCasesJSON, setCodeTestCasesJSON,
}) => {
  const { t } = useTranslation();

  const renderChoiceRow = (i, control) => {
    const currentText = typeof options[i] === 'string' ? options[i].trim() : "";
    const isOptionEmptyError = errors.emptyOptions && !currentText;

    // Шукаємо, чи є поточний рядок дублікатом (логічно)
    const isActualDuplicate = currentText !== "" && 
      options.some((opt, index) => {
        const optText = typeof opt === 'string' ? opt.trim() : "";
        return index !== i && optText === currentText;
      });

    // ЗМІНА ТУТ: Показуємо візуальну помилку ТІЛЬКИ якщо вона передана в об'єкті errors (після сабміту)
    const showDuplicateError = isActualDuplicate && errors.duplicateOptions;

    const hasErrorClass = isOptionEmptyError || showDuplicateError;

    return (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '10px' }}>
        <div className="testCreationMainCreatorAnswers__option">
          
          <label className="testCreationMainCreatorAnswers__control">
             {control}
          </label>

          <div className={`testCreationMainCreatorAnswers__input-wrapper ${hasErrorClass ? 'input-error-placeholder' : ''}`}>
            <input
              type="text"
              placeholder={isOptionEmptyError ? t('testCreationAnswers.errors.fillOption') : t('testCreationAnswers.placeholders.option')}
              className="testCreationMainCreatorAnswers__input"
              value={options[i]}
              onChange={e => updateOption(i, e.target.value)}
            />

            <div className="testCreationMainCreatorAnswers__btns">
              <button className="testCreationMainCreator__icon-btn" title={t('testCreationAnswers.addImage')}>
                <FontAwesomeIcon icon={faImage} />
              </button>
              {i >= minBase && (
                <button
                  type="button"
                  className="testCreationMainCreatorAnswers__btn-remove"
                  title={t('testCreationAnswers.removeOption')}
                  onClick={() => removeOption(i)}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
        
      </div>
    );
  };

  const renderCommonComment = () => (
    <div style={{ marginTop: '20px' }}>
      <label className="testCreationMainCreatorAnswers__text" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
        {t('testCreationAnswers.commentLabel')}
      </label>
      <input
        type="text"
        className="testCreationMainCreatorAnswers__input-open"
        placeholder={t('testCreationAnswers.placeholders.comment')}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
    </div>
  );

  switch (selectedType) {
    case "regular":
      return (
        <div className="testCreationMainCreatorAnswers">
          <h3 className={`testCreationMainCreatorAnswers__title ${errors.correctSelection ? 'error-text-blink' : ''}`}>
            {t('testCreationAnswers.titles.singleChoice')}
          </h3>

          {options.map((_, i) =>
            renderChoiceRow(i, (
              <>
                <input
                  type="radio"
                  name="regularQuestionRadio"
                  className='testCreationMainCreatorAnswers__none'
                  checked={regularCorrect === i}
                  onChange={() => pickRegularCorrect(i)}
                />
                <span className={`testCreationMainCreatorAnswers__radio-circle ${errors.correctSelection ? 'error-border' : ''}`}></span>
              </>
            ))
          )}

          <button className="testCreationMainCreatorAnswers__add" onClick={addOption}>
            {t('testCreationAnswers.addOption')} <span>+</span>
          </button>
          {renderCommonComment()}
        </div>
      );

    case "multiple":
      return (
        <div className="testCreationMainCreatorAnswers">
          <h3 className={`testCreationMainCreatorAnswers__title ${errors.correctSelection ? 'error-text-blink' : ''}`}>
            {t('testCreationAnswers.titles.multipleChoice')}
          </h3>

          {options.map((_, i) =>
            renderChoiceRow(i, (
              <>
                <input
                  type="checkbox"
                  name="multipleQuestionCheckbox"
                  className='testCreationMainCreatorAnswers__none'
                  checked={!!multipleCorrect[i]}
                  onChange={() => toggleMultipleCorrect(i)}
                />
                <span className={`testCreationMainCreatorAnswers__radio-square ${errors.correctSelection ? 'error-border' : ''}`}></span>
              </>
            ))
          )}

          <button className="testCreationMainCreatorAnswers__add" onClick={addOption}>
            {t('testCreationAnswers.addOption')} <span>+</span>
          </button>
          {renderCommonComment()}
        </div>
      );

    case "open":
      return (
        <div className="testCreationMainCreatorAnswers testCreationMainCreatorAnswers-open">
          <h3 className='testCreationMainCreatorAnswers__title'>{t('testCreationAnswers.titles.answer')}</h3>

          <label className='testCreationMainCreatorAnswers__text'>
            <input
              className='testCreationMainCreatorAnswers__none'
              type="checkbox"
              checked={openExpectedEnabled}
              onChange={(e) => setOpenExpectedEnabled(e.target.checked)}
            />
            <span className='testCreationMainCreatorAnswers__radio-circle'></span>
            {t('testCreationAnswers.expectedAnswerLabel')}
          </label>
          <input
            type="text"
            placeholder={errors.openExpectedText ? t('testCreationAnswers.errors.fillExpected') : t('testCreationAnswers.placeholders.answer')}
            className={`testCreationMainCreatorAnswers__input-open ${errors.openExpectedText ? 'input-error-placeholder' : ''}`}
            disabled={!openExpectedEnabled}
            value={openExpectedText}
            onChange={e => setOpenExpectedText(e.target.value)}
          />
          {renderCommonComment()}
        </div>
      );

    case "practical":
      return (
        <div className="testCreationMainCreatorAnswers testCreationMainCreatorAnswers-open">
          <h3 className='testCreationMainCreatorAnswers__title'>{t('testCreationAnswers.titles.codeSettings')}</h3>
          <div style={{marginBottom: '15px'}}>
              <label className="testCreationMainCreatorAnswers__text" style={{display: 'block', marginBottom: '5px'}}>{t('testCreationAnswers.code.language')}:</label>
              <select 
                className="testCreationMainCreatorAnswers__input-open" 
                style={{padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}}
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
              >
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
              </select>
          </div>

          <div style={{marginBottom: '15px'}}>
            <label className="testCreationMainCreatorAnswers__text" style={{ display: 'block', marginBottom: '5px' }}>{t('testCreationAnswers.code.methodName')}:</label>
            <input
              type="text"
              className={`testCreationMainCreatorAnswers__input-open ${errors.codeMethodName ? 'input-error-placeholder' : ''}`}
              placeholder={errors.codeMethodName ? t('testCreationAnswers.errors.methodRequired') : t('testCreationAnswers.placeholders.method')}
              value={codeMethodName}
              onChange={(e) => setCodeMethodName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label className="testCreationMainCreatorAnswers__text" style={{ display: 'block', marginBottom: '5px' }}>{t('testCreationAnswers.code.template')}:</label>
            <textarea
              rows="5"
              className={`testCreationMainCreatorAnswers__input-open ${errors.codeTemplate ? 'input-error-placeholder' : ''}`}
              style={{ resize: 'vertical', fontFamily: 'monospace' }}
              placeholder={errors.codeTemplate ? t('testCreationAnswers.errors.templateRequired') : "public int sum()..."}
              value={codeTemplate}
              onChange={(e) => setCodeTemplate(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label className="testCreationMainCreatorAnswers__text" style={{ display: 'block', marginBottom: '5px' }}>{t('testCreationAnswers.code.testCases')}:</label>
            <textarea
              rows="3"
              className={`testCreationMainCreatorAnswers__input-open ${errors.codeTestCasesJSON ? 'input-error-placeholder' : ''}`}
              style={{ resize: 'vertical', fontFamily: 'monospace' }}
              placeholder={errors.codeTestCasesJSON ? t('testCreationAnswers.errors.jsonError') : '[{"args": [1, 2], "expected": 3}]'}
              value={codeTestCasesJSON}
              onChange={(e) => setCodeTestCasesJSON(e.target.value)}
            />
          </div>
          {renderCommonComment()}
        </div>
      );

    default:
      return null;
  }
}

export default TestCreationMainAnswers;