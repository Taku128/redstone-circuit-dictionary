import React from 'react';
import { Link } from 'react-router-dom';
import useSearchDictionaryWord from '../hooks/useSearchDictionaryWord';
import './Header.css';

const Header: React.FC = () => {
  const { searchQuery, handleSearchChange, handleSearchSubmit } = useSearchDictionaryWord();

  return (
    <header className='header-header'>
      <Link to="/" className='header-home-button'>ホームボタン</Link>
      <form onSubmit={handleSearchSubmit} className='header-form'>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
          className='header-input'
        />
        <button type="submit" className='header-search-button'>Search</button>
      </form>
      <Link to="/Create" className='header-home-button'>新しく投稿する</Link>
    </header>
  );
};

export default Header;