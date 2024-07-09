import React from 'react';
import { Link } from 'react-router-dom';
import useSearch from '../hooks/useSearch';
import '../../../css/Header.css';

const Header: React.FC = () => {
  const { searchQuery, handleSearchChange, handleSearchSubmit } = useSearch();

  return (
    <header>
      <Link to="/" className='home-button'>ホームボタン</Link>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
        <button type="submit" className='search-button'>Search</button>
      </form>
      <Link to="/Create" className='home-button'>新しく投稿する</Link>
    </header>
  );
};

export default Header;
