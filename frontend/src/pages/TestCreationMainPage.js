import React from 'react'
import GeneralTestInfoHeader from '../components/GeneralTestInfoHeader/GeneralTestInfoHeader'
import TestCreationMainCount from '../components/testCreationMain/TestCreationMainCount/TestCreationMainCount'
import TestCreationMainCreator from '../components/testCreationMain/TestCreationMainCreator/TestCreationMainCreator'

const TestCreationMainPage = () => {
    return (
      <div className='page'>
        <GeneralTestInfoHeader field="Data Science" title="JUNIOR DATA SCIENTIST" location="Lviv" date="21.03.2025" time="18:00" />
        <TestCreationMainCount questionsCount={0} />
        <TestCreationMainCreator />
        <div className='testCreationMainButtons'>
          <div className='container testCreationMainButtons__container'>
            <button className='testCreationMainButtons__next white-btn'>Наступне запитання</button>
            <button className='testCreationMainButtons__finish black-btn'>Переглянути результат</button>
          </div>
        </div>
      </div>
    )
}

export default TestCreationMainPage