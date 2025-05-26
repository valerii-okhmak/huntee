import React from 'react';
import './ChooseYourFutureItem.css';
import { Link } from 'react-router-dom';

const ChooseYourFutureItem = ({testname}) => {
  return (
    <div className="chs-your-future-item">
      <Link to='/test' className="chs-your-future-testname">{testname}</Link>
    </div>
  );
};

export default ChooseYourFutureItem;
