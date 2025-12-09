import React from 'react';
import './ChooseYourFutureItem.css';
import { Link } from 'react-router-dom';

const ChooseYourFutureItem = ({ testname }) => {

  const query = new URLSearchParams({ sphere: testname }).toString();

  return (
    <div className="chs-your-future-item">
      <Link 
        to={`/alltests?${query}`} 
        className="chs-your-future-testname"
      >
        {testname}
      </Link>
    </div>
  );
};

export default ChooseYourFutureItem;
