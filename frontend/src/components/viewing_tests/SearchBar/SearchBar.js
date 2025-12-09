import React from 'react';
import './SearchBar.css';
import lupa from '../../../img/search-icon.png'

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="searchbar-block">
    <div className="searchbar-input-wrap">
        <input
        className="searchbar-input"
        type="text"
        placeholder="Пошук"
        value={value}
        onChange={(e) => onChange(e.target.value)} 
        />
        <img src={lupa} alt="search" className="searchbar_icon" />
    </div>
    </div>
  );
};

export default SearchBar;