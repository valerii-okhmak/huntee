import React, { useState } from "react";
import './TestCreationMainAnswers.css'
import addImage_icon from '../../../img/testCreation/addImage.png'

const TestCreationMainAnswers = ({selectedType}) => {
    const [expectedCheckedOpen, setExpectedCheckedOpen] = useState(true);
    const [commentCheckedOpen, setCommentCheckedOpen] = useState(false);
    const [expectedCheckedPractical, setExpectedCheckedPractical] = useState(true);
    const [commentCheckedPractical, setCommentCheckedPractical] = useState(false);

    switch (selectedType) {
        case "regular":
          return (
            <div className="testCreationMainCreatorAnswers">
              <h3 className='testCreationMainCreatorAnswers__title'>Відповідь</h3>
              <div className="testCreationMainCreatorAnswers__option">
                <label className='testCreationMainCreatorAnswers__75p'>
                    <input type="radio" name="regularQuestionRadio" className='testCreationMainCreatorAnswers__none'/>
                    <span className='testCreationMainCreatorAnswers__radio-circle'></span>
                    <input type="text" placeholder="Введіть варіант відповіді" className="testCreationMainCreatorAnswers__input" />
                </label>
                <button className="testCreationMainCreatorAnswers__btn" title="Додати зображення">
                    <img alt='add image' src={addImage_icon} />
                </button>
              </div>
              <div className="testCreationMainCreatorAnswers__option">
                <label className='testCreationMainCreatorAnswers__75p'>
                    <input type="radio" name="regularQuestionRadio" className='testCreationMainCreatorAnswers__none'/>
                    <span className='testCreationMainCreatorAnswers__radio-circle'></span>
                    <input type="text" placeholder="Введіть варіант відповіді" className="testCreationMainCreatorAnswers__input" />
                </label>
                <button className="testCreationMainCreatorAnswers__btn" title="Додати зображення">
                    <img alt='add image' src={addImage_icon} />
                </button>
              </div>
              <button className="testCreationMainCreatorAnswers__add">Додати варіант відповіді <span>+</span></button>
            </div>
          );
        case "open":
          return (
            <div className="testCreationMainCreatorAnswers testCreationMainCreatorAnswers-open">
              <h3 className='testCreationMainCreatorAnswers__title'>Відповідь</h3>
              <label className='testCreationMainCreatorAnswers__text'>
                <input className='testCreationMainCreatorAnswers__none' type="checkbox" defaultChecked checked={expectedCheckedOpen} onChange={(e) => setExpectedCheckedOpen(e.target.checked)}/>
                <span className='testCreationMainCreatorAnswers__radio-circle'></span> 
                Очікувана відповідь
              </label>
              <input type="text" placeholder="Введіть відповідь" className="testCreationMainCreatorAnswers__input-open" disabled={!expectedCheckedOpen}/>
              <label className='testCreationMainCreatorAnswers__text'>
                <input className='testCreationMainCreatorAnswers__none' type="checkbox" defaultChecked checked={commentCheckedOpen} onChange={(e) => setCommentCheckedOpen(e.target.checked)}/> 
                <span className='testCreationMainCreatorAnswers__radio-circle'></span>
                Коментар
              </label>
              <input type="text" placeholder="Введіть коментар" className="testCreationMainCreatorAnswers__input-open" disabled={!commentCheckedOpen}/>
            </div>
          );
        case "multiple":
          return (
            <div className="testCreationMainCreatorAnswers">
              <h3 className='testCreationMainCreatorAnswers__title'>Відповідь</h3>
              <div className="testCreationMainCreatorAnswers__option">
                <label className='testCreationMainCreatorAnswers__75p'>
                    <input type="checkbox" className='testCreationMainCreatorAnswers__none'/>
                    <span className='testCreationMainCreatorAnswers__radio-square'></span>
                    <input type="text" placeholder="Введіть варіант відповіді" className="testCreationMainCreatorAnswers__input" />
                </label>
                <button className="testCreationMainCreatorAnswers__btn" title="Додати зображення">
                    <img alt='add image' src={addImage_icon} />
                </button>
              </div>
              <div className="testCreationMainCreatorAnswers__option">
                <label className='testCreationMainCreatorAnswers__75p'>
                    <input type="checkbox" className='testCreationMainCreatorAnswers__none'/>
                    <span className='testCreationMainCreatorAnswers__radio-square'></span>
                    <input type="text" placeholder="Введіть варіант відповіді" className="testCreationMainCreatorAnswers__input" />
                </label>
                <button className="testCreationMainCreatorAnswers__btn" title="Додати зображення">
                    <img alt='add image' src={addImage_icon} />
                </button>
              </div>
              <button className="testCreationMainCreatorAnswers__add">Додати варіант відповіді <span>+</span></button>
            </div>
          );
        case "practical":
          return (
            <div className="testCreationMainCreatorAnswers testCreationMainCreatorAnswers-open">
              <h3 className='testCreationMainCreatorAnswers__title'>Відповідь</h3>
              <label className='testCreationMainCreatorAnswers__text'>
                <input className='testCreationMainCreatorAnswers__none' type="checkbox" defaultChecked checked={expectedCheckedPractical} onChange={(e) => setExpectedCheckedPractical(e.target.checked)}/>
                <span className='testCreationMainCreatorAnswers__radio-circle'></span> 
                Очікувана відповідь
              </label>
              <input type="text" placeholder="Введіть відповідь" className="testCreationMainCreatorAnswers__input-open" disabled={!expectedCheckedPractical}/>
              <label className='testCreationMainCreatorAnswers__text'>
                <input className='testCreationMainCreatorAnswers__none' type="checkbox" defaultChecked checked={commentCheckedPractical} onChange={(e) => setCommentCheckedPractical(e.target.checked)}/> 
                <span className='testCreationMainCreatorAnswers__radio-circle'></span>
                Коментар
              </label>
              <input type="text" placeholder="Введіть коментар" className="testCreationMainCreatorAnswers__input-open" disabled={!commentCheckedPractical}/>
            </div>
          );
        default:
          return null;
    }
}

export default TestCreationMainAnswers