import React from 'react';
import { useTranslation } from 'react-i18next';
import './SearchBar.css';
import lupa from '../../../img/search-icon.png'

const SearchBar = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className="searchbar-block">
    <div className="searchbar-input-wrap">
        <input
        className="searchbar-input"
        type="text"
        placeholder={t('searchBar.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)} 
        />
        <img src={lupa} alt="search" className="searchbar_icon" />
    </div>
    </div>
  );
};

export default SearchBar;