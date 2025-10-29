import React, { useState, useMemo } from 'react';
import './SearchBar.css';
import lupa from '../../../img/search-icon.png'

const SearchBar = ({ selectedLocations = [], allTests = [] }) => {

  return (
    <div className="searchbar-block">
    <div className="searchbar-input-wrap">
        <input
        className="searchbar-input"
        type="text"
        placeholder="Пошук"
        />
        <img src={lupa} alt="search" className="searchbar_icon" />
    </div>
    </div>
  );
};

export default SearchBar;
