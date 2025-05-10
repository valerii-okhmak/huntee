import React from 'react';
import './ChooseYourFutureItem.css';

const ChooseYourFutureItem = ({testname}) => {
  return (
    <div className="chs-your-future-item">
      <a href='/' className="chs-your-future-testname">{testname}</a>
    </div>
  );
};

export default ChooseYourFutureItem;
