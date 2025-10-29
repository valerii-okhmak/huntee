import React, { useState } from "react";
import './TestCreationMainCreator.css'
import regular_icon from '../../../img/testCreation/regular.png'
import multiple_icon from '../../../img/testCreation/multiple.png'
import open_icon from '../../../img/testCreation/open.png'
import practical_icon from '../../../img/testCreation/practical.png'
import addImage_icon from '../../../img/testCreation/addImage.png'
import TestCreationMainAnswers from "../TestCreationMainAnswers/TestCreationMainAnswers";

const TestCreationMainCreator = () => {
    const [selectedType, setSelectedType] = useState("regular");

    const [questionText, setQuestionText] = useState("");
    const [addToBank, setAddToBank] = useState(false);

    return (
        <div className='testCreationMainCreator'>
            <div className='container testCreationMainCreator__container'>
                <h2 className='testCreationMainCreator__title'>Оберіть тип запитання:</h2>
                <div className='testCreationMainCreator__typeSelector'>
                    <button className={`testCreationMainCreator__selectedType ${selectedType === "regular" ? "active" : ""}`} onClick={() => setSelectedType("regular")}>
                        <img alt='img' className='testCreationMainCreator_icon' src={regular_icon} />
                        З однією відповіддю
                    </button>
                    <button className={`testCreationMainCreator__selectedType ${selectedType === "multiple" ? "active" : ""}`} onClick={() => setSelectedType("multiple")}>
                        <img alt='img' className='testCreationMainCreator_icon' src={multiple_icon} />
                        Множинний вибір
                    </button>
                    <button className={`testCreationMainCreator__selectedType ${selectedType === "open" ? "active" : ""}`} onClick={() => setSelectedType("open")}>
                        <img alt='img' className='testCreationMainCreator_icon' src={open_icon} />
                        Відкрита відповідь
                    </button>
                    <button className={`testCreationMainCreator__selectedType ${selectedType === "practical" ? "active" : ""}`} onClick={() => setSelectedType("practical")}>
                        <img alt='img' className='testCreationMainCreator_icon' src={practical_icon} />
                        Практичний тест
                    </button>
                </div>
                <div className="testCreationMainCreator__questionField">
                    <div className="testCreationMainCreator__questionField-header">
                        <h2 className="testCreationMainCreator__questionField-title">Запитання</h2>
                        <label className="testCreationMainCreator__addToJar">
                            <input
                                type="checkbox"
                                checked={addToBank}
                                onChange={(e) => setAddToBank(e.target.checked)}
                            />
                            <span className="testCreationMainCreator__addToJar_radio-circle"></span>
                            <span>Додати запитання до банки запитань</span>
                        </label>
                    </div>
                    <div className="testCreationMainCreator__questionField-wrapper">
                        <input type="text" placeholder="Введіть запитання" value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="testCreationMainCreator__questionField-input" />
                        <button className="testCreationMainCreator__questionField-btn" title="Додати зображення">
                            <img alt='add image' src={addImage_icon} />
                        </button>
                    </div>
                </div>
                <TestCreationMainAnswers selectedType={selectedType} />
            </div>
        </div>
    )
}

export default TestCreationMainCreator