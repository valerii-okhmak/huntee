import React, { useState } from 'react'; // 1. Імпортуємо useState
import Test from '../Test/Test';
import './TestsBlock.css';
import lupa from '../../../img/search-icon.png';

const TestsBlock = ({selectedLocations, allTests}) => {

  const [searchQuery, setSearchQuery] = useState('');
  const filteredTests = allTests
    .filter(test => 
      selectedLocations.length === 0 || selectedLocations.includes(test.location)
    )
    .filter(test => {
      if (searchQuery === '') {
        return true; 
      }
      const query = searchQuery.toLowerCase();
      
      return test.title.toLowerCase().includes(query) || 
             test.type.toLowerCase().includes(query) || 
             test.location.toLowerCase().includes(query);
    });

  return (
    <div className='testsBlock'>
        <div className="search-container">
          <img src={lupa} alt='search' className='search_icon' />

          <input 
            type="text" 
            placeholder="Пошук за назвою, сферою, локацією..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        
        {filteredTests.map(test => (
          <Test key={test.id} {...test} />
        ))}
    </div>
  )
}

export default TestsBlock;