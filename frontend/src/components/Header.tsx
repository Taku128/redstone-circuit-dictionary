import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './css/Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement search functionality here, for example:
    // navigate(`/search?query=${searchQuery}`);
    console.log('Search query:', searchQuery);
  };

  return (
    <header>
      <Link to="/" className='home-button'>/Home</Link>
        <form onSubmit={handleSearchSubmit}>
            <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            />
            <button type="submit" className='search-button'>Search</button>
        </form>
        <Link to="/Creat" className='home-button'>新しく投稿する</Link>
    </header>
  );
};

export default Header;
