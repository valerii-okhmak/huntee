import React from "react";
import './TestCreationMainAnswers.css'
import addImage_icon from '../../../img/testCreation/addImage.png'

const TestCreationMainAnswers = ({
  selectedType,
  comment, setComment, // Новий проп для коментаря

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
  openCommentEnabled,
  setOpenCommentEnabled,
  openExpectedText,
  setOpenExpectedText,
  openCommentText,
  setOpenCommentText,

  // practical (Code) - НОВІ PROPS
  codeLanguage, setCodeLanguage,
  codeMethodName, setCodeMethodName,
  codeTemplate, setCodeTemplate,
  codeTestCasesJSON, setCodeTestCasesJSON,
  
  // practical (Text) - СТАРІ PROPS (для сумісності, якщо ви ще використовуєте текстовий варіант)
  prExpectedEnabled,
  setPrExpectedEnabled,
  prCommentEnabled,
  setPrCommentEnabled,
  prExpectedText,
  setPrExpectedText,
  prCommentText,
  setPrCommentText,
}) => {

  const renderChoiceRow = (i, control) => (
    <div key={i} className="testCreationMainCreatorAnswers__option">
      <label className='testCreationMainCreatorAnswers__75p'>
        {control}
        <input
          type="text"
          placeholder="Введіть варіант відповіді"
          className="testCreationMainCreatorAnswers__input"
          value={options[i]}
          onChange={e => updateOption(i, e.target.value)}
        />
      </label>

      <div className="testCreationMainCreatorAnswers__btns">
        <button className="testCreationMainCreatorAnswers__btn" title="Додати зображення">
          <img alt='add image' src={addImage_icon} />
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

  // Рендер поля для коментаря (спільного для всіх)
  const renderCommonComment = () => (
     <div style={{marginTop: '20px'}}>
        <label className="testCreationMainCreatorAnswers__text" style={{fontWeight: 'bold', marginBottom: '5px', display: 'block'}}>
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
          <h3 className='testCreationMainCreatorAnswers__title'>Відповідь (позначте одну правильну)</h3>

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
                <span className='testCreationMainCreatorAnswers__radio-circle'></span>
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
          <h3 className='testCreationMainCreatorAnswers__title'>Відповідь (позначте мінімум одну правильну)</h3>

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
                <span className='testCreationMainCreatorAnswers__radio-square'></span>
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
            placeholder="Введіть відповідь"
            className="testCreationMainCreatorAnswers__input-open"
            disabled={!openExpectedEnabled}
            value={openExpectedText}
            onChange={e => setOpenExpectedText(e.target.value)}
          />

          {/* Старий коментар залишаємо, якщо хочете, або замінюємо на загальний */}
          {renderCommonComment()}
        </div>
      );

    case "practical":
      return (
        <div className="testCreationMainCreatorAnswers testCreationMainCreatorAnswers-open">
          <h3 className='testCreationMainCreatorAnswers__title'>Налаштування коду</h3>

          <div style={{marginBottom: '15px'}}>
              <label className="testCreationMainCreatorAnswers__text" style={{display: 'block', marginBottom: '5px'}}>Мова програмування:</label>
              <select 
                className="testCreationMainCreatorAnswers__input-open" // Можна додати свій клас для select
                style={{padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '100%'}}
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
              >
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
              </select>
          </div>

          <div style={{marginBottom: '15px'}}>
              <label className="testCreationMainCreatorAnswers__text" style={{display: 'block', marginBottom: '5px'}}>Назва методу (напр. "sum"):</label>
              <input 
                type="text" 
                className="testCreationMainCreatorAnswers__input-open"
                placeholder="sum"
                value={codeMethodName}
                onChange={(e) => setCodeMethodName(e.target.value)}
              />
          </div>

          <div style={{marginBottom: '15px'}}>
              <label className="testCreationMainCreatorAnswers__text" style={{display: 'block', marginBottom: '5px'}}>Шаблон коду (для студента):</label>
              <textarea 
                rows="5"
                className="testCreationMainCreatorAnswers__input-open" // Або textarea клас
                style={{resize: 'vertical', fontFamily: 'monospace'}}
                placeholder={`public int sum(int a, int b) {\n    return 0;\n}`}
                value={codeTemplate}
                onChange={(e) => setCodeTemplate(e.target.value)}
              />
          </div>

          <div style={{marginBottom: '15px'}}>
              <label className="testCreationMainCreatorAnswers__text" style={{display: 'block', marginBottom: '5px'}}>Тест-кейси (JSON):</label>
              <textarea 
                rows="3"
                className="testCreationMainCreatorAnswers__input-open"
                style={{resize: 'vertical', fontFamily: 'monospace'}}
                placeholder='[{"args": [1, 2], "expected": 3}]'
                value={codeTestCasesJSON}
                onChange={(e) => setCodeTestCasesJSON(e.target.value)}
              />
            <small style={{color: '#666', display: 'block', marginTop: '5px'}}>
              Формат: {'[{"args": [arg1, arg2], "expected": result}]'}
            </small>
          </div>
          
          {renderCommonComment()}
        </div>
      );

    default:
      return null;
  }
}

export default TestCreationMainAnswers;