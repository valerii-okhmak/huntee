import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Test from '../Test/Test';
import JoinByCodeButton from '../../JoinByCodeButton/JoinByCodeButton'; 
import './TestsBlock.css';
import lupa from '../../../img/search-icon.png';

const TestsBlock = ({ selectedLocations = [], allTests = [] }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTests = allTests
    .filter(test =>
      selectedLocations.length === 0 || selectedLocations.includes(test.location)
    )
    .filter(test => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();

      return (
        test.title.toLowerCase().includes(query) ||
        test.type.toLowerCase().includes(query) ||
        test.location.toLowerCase().includes(query)
      );
    });

  return (
    <div className='testsBlock'>
      
      <div className="tests-controls-row" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        
        <div className="search-container" style={{ margin: 0, flex: 1 }}>
          <img src={lupa} alt='search' className='search_icon' />
          <input
            type="text"
            placeholder={t('testsBlock.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <JoinByCodeButton customStyle={{ margin: 0, height: '45px', padding: '0 20px' }} />

      </div>

      {filteredTests.map(test => (
        <Test key={test.id} {...test} />
      ))}

    </div>
  );
};

export default TestsBlock;