import React from 'react'
import Test from '../Test/Test'
import './TestsBlock.css'
import lupa from '../../../img/search-icon.png'

const TestsBlock = ({selectedLocations,allTests}) => {

    const filteredTests = selectedLocations.length === 0
    ? allTests
    : allTests.filter(test => selectedLocations.includes(test.location));

  return (
    <div className='testsBlock'>
        <div class="search-container">
          <img src={lupa} alt='search' className='search_icon' />

          <input type="text" placeholder="Пошук" />
        </div>
        {filteredTests.map(test => (
          <Test key={test.id} {...test} />
        ))}
    </div>
  )
}

export default TestsBlock