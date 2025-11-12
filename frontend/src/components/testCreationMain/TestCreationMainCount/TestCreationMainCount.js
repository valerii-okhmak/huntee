import React from 'react'
import './TestCreationMainCount.css'

const TestCreationMainCount = ({questionsCount}) => {
  return (
    <div className='testCreationMainCount'>
        <div className='container testCreationMainCount__container'>
            <hr></hr>
            <p>Даний тест містить: <span className='testCreationMainCount__number'>{questionsCount}</span> запитань </p>
        </div>
    </div>
  )
}

export default TestCreationMainCount