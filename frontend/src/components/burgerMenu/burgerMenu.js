import React from 'react';
import { Link } from 'react-router-dom';
import './burgerMenu.css';

const burgerMenu = () => {
  return (
        <div className='burger-container'>
            <div className='burger-menu'>
                <div className='burger-line'></div>
                <ul className='burger-list'>
                    <li><Link to="/profile" className='link'><span className='digit'>1</span><span className='burger-text'>Мій аккаунт</span></Link></li>
                    <li><Link to="/alltests" className='link'><span className='digit'>2</span><span className='burger-text'>Активні тести</span></Link></li>
                    <li><Link to="#footer" className='link'><span className='digit'>3</span><span className='burger-text'>Пробні тести</span></Link></li>
                </ul>
            </div>    
        </div>
  );
};

export default burgerMenu;
