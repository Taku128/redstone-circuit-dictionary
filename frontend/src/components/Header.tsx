import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './css/Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If search query is empty, navigate to search results page with empty state
    if (!searchQuery.trim()) {
      navigate('/', { state: { results: [], query: '' } });
      return;
    }

    // Make an API call to fetch search results based on the search query
    try {
      const response = await fetch(`https://u4dokqntp1.execute-api.ap-northeast-1.amazonaws.com/dev/dictionary/?word=${searchQuery}`);
      const data = await response.json();
      console.log('Search results:', data);
      // Navigate to search results page with the search data
      navigate('/', { state: { results: data, query: searchQuery } });
    } catch (error) {
      console.error('Error fetching search results:', error);
      // Handle the error case by navigating with an error state if needed
      navigate('/', { state: { results: [], query: searchQuery, error: 'Error fetching search results' } });
    }
  };

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
      <Link to="/Creat" className='home-button'>新しく投稿する</Link>
    </header>
  );
};

export default Header;
