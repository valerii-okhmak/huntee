import React from 'react'
import Test from '../Test/Test'
import './TestsBlock.css'
import lupa from '../../../img/search-icon.png'

const TestsBlock = () => {
  return (
    <div className='testsBlock'>
        <div class="search-container">
          <img src={lupa} alt='search' className='search_icon' />

          <input type="text" placeholder="Пошук" />
        </div>
        <Test/>
        <Test/>
        <Test/>
    </div>
  )
}

export default TestsBlock