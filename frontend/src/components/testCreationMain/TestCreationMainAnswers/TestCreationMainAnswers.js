import React from "react";
import './TestCreationMainAnswers.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

const TestCreationMainAnswers = ({
  selectedType,
  comment, setComment,
  errors, // Отримуємо помилки

  // options
  options,
  updateOption,
  addOption,
  removeOption,
  minBase,

  // regular
  regularCorrect,
  pickRegularCorrect,

  // multiple
  multipleCorrect,
  toggleMultipleCorrect,

  // open
  openExpectedEnabled,
  setOpenExpectedEnabled,
  openExpectedText,
  setOpenExpectedText,

  // practical (Code)
  codeLanguage, setCodeLanguage,
  codeMethodName, setCodeMethodName,
  codeTemplate, setCodeTemplate,
  codeTestCasesJSON, setCodeTestCasesJSON,
}) => {

  const renderChoiceRow = (i, control) => {
    // Перевірка чи саме цей варіант порожній при помилці
    const isOptionEmptyError = errors.emptyOptions && !options[i].trim();

    return (
      <div key={i} className="testCreationMainCreatorAnswers__option">
        <label className='testCreationMainCreatorAnswers__75p'>
          {control}
          <input
            type="text"
            // Динамічний плейсхолдер та клас
            placeholder={isOptionEmptyError ? "Заповніть цей варіант!" : "Введіть варіант відповіді"}
            className={`testCreationMainCreatorAnswers__input ${isOptionEmptyError ? 'input-error-placeholder' : ''}`}
            value={options[i]}
            onChange={e => updateOption(i, e.target.value)}
          />
        </label>

        <div className="testCreationMainCreatorAnswers__btns">
          <button className="testCreationMainCreator__questionField-btn" title="Додати зображення">
            <FontAwesomeIcon icon={faImage} />
          </button>
          {i >= minBase && (
            <button
              type="button"
              className="testCreationMainCreatorAnswers__btn testCreationMainCreatorAnswers__btn--remove"
              title="Видалити варіант"
              onClick={() => removeOption(i)}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderCommonComment = () => (
    <div style={{ marginTop: '20px' }}>
      <label className="testCreationMainCreatorAnswers__text" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
        Коментар (підказка для студента):
      </label>
      <input
        type="text"
        className="testCreationMainCreatorAnswers__input-open"
        placeholder="Введіть коментар"
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
            Відповідь (позначте одну правильну)
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
            Додати варіант відповіді <span>+</span>
          </button>
          {renderCommonComment()}
        </div>
      );

    case "multiple":
      return (
        <div className="testCreationMainCreatorAnswers">
          <h3 className={`testCreationMainCreatorAnswers__title ${errors.correctSelection ? 'error-text-blink' : ''}`}>
            Відповідь (позначте мінімум одну правильну)
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
            Додати варіант відповіді <span>+</span>
          </button>
          {renderCommonComment()}
        </div>
      );

    case "open":
      return (
        <div className="testCreationMainCreatorAnswers testCreationMainCreatorAnswers-open">
          <h3 className='testCreationMainCreatorAnswers__title'>Відповідь</h3>

          <label className='testCreationMainCreatorAnswers__text'>
            <input
              className='testCreationMainCreatorAnswers__none'
              type="checkbox"
              checked={openExpectedEnabled}
              onChange={(e) => setOpenExpectedEnabled(e.target.checked)}
            />
            <span className='testCreationMainCreatorAnswers__radio-circle'></span>
            Очікувана відповідь
          </label>
          <input
            type="text"
            // Помилка для відкритої відповіді
            placeholder={errors.openExpectedText ? "Введіть очікувану відповідь!" : "Введіть відповідь"}
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
          <h3 className='testCreationMainCreatorAnswers__title'>Налаштування коду</h3>

          {/* Вибір мови зазвичай не буває порожнім, але назва методу - так */}
          <div style={{ marginBottom: '15px' }}>
            <label className="testCreationMainCreatorAnswers__text" style={{ display: 'block', marginBottom: '5px' }}>Назва методу:</label>
            <input
              type="text"
              className={`testCreationMainCreatorAnswers__input-open ${errors.codeMethodName ? 'input-error-placeholder' : ''}`}
              placeholder={errors.codeMethodName ? "Обов'язково вкажіть назву методу!" : "Наприклад: sum"}
              value={codeMethodName}
              onChange={(e) => setCodeMethodName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label className="testCreationMainCreatorAnswers__text" style={{ display: 'block', marginBottom: '5px' }}>Шаблон коду:</label>
            <textarea
              rows="5"
              className={`testCreationMainCreatorAnswers__input-open ${errors.codeTemplate ? 'input-error-placeholder' : ''}`}
              style={{ resize: 'vertical', fontFamily: 'monospace' }}
              placeholder={errors.codeTemplate ? "Введіть шаблон коду для студента!" : "public int sum()..."}
              value={codeTemplate}
              onChange={(e) => setCodeTemplate(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label className="testCreationMainCreatorAnswers__text" style={{ display: 'block', marginBottom: '5px' }}>Тест-кейси (JSON):</label>
            <textarea
              rows="3"
              className={`testCreationMainCreatorAnswers__input-open ${errors.codeTestCasesJSON ? 'input-error-placeholder' : ''}`}
              style={{ resize: 'vertical', fontFamily: 'monospace' }}
              placeholder={errors.codeTestCasesJSON ? "Помилка в JSON форматі!" : '[{"args": [1, 2], "expected": 3}]'}
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