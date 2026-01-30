import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Test from '../Test/Test';
import './TestsBlock.css';
import lupa from '../../../img/search-icon.png';

const TestsBlock = ({selectedLocations, allTests}) => {
  const { t } = useTranslation();
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
            placeholder={t('testsBlock.placeholder')}
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