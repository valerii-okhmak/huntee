import React from 'react';
import { Link } from 'react-router-dom';
import './burgerMenu.css';

const burgerMenu = () => {
  return (
        <div className='burger-container'>
            <div className='burger-menu'>
            <h2>МЕНЮ</h2>
                <div className='burger-line'></div>
                <ul className='burger-list'>
                    <li><Link to="/" className='link'>1</Link></li>
                    <li><Link to="/auth" className='link'>2</Link></li>
                    <li><Link to="#footer" className='link'>3</Link></li>
                </ul>
            </div>    
        </div>
  );
};

export default burgerMenu;
