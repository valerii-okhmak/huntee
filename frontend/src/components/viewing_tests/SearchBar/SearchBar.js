// SearchBar.jsx
import React, { useState, useMemo } from 'react';
import TestCard from '../TestCard/TestCard'; // <-- перевір шлях і поправ, якщо треба
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
        <img src={lupa} alt="search" className="search_icon" />
    </div>
    </div>
  );
};

export default SearchBar;
