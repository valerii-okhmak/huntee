import React from 'react'
import './top.css'

const top = () => {
  return (
    <div className='testsTop'>
        <div className='container testsTop_container'>
            <div className='main'>
                <div className='blackbox'></div>
                <h1 className='addtitle'>Пройди пробне тестування</h1>
            </div>
            <div className='additionalTrial'>
                <div className='addline'></div>
                <strong>Дізнайся як проходять тести</strong>
            </div>
        </div>
    </div>
  )
}

export default top