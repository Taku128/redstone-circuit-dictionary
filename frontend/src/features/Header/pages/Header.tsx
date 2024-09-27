import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useSearchDictionaryWord from '../hooks/useSearchDictionaryWord';
import './Header.css';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import awsConfiguration from '../../../awsConfiguration';
import SignOut from '../../Auth/pages/SignOut/SignOutPage';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

const Header: React.FC = () => {
  const { searchQuery, handleSearchChange, handleSearchSubmit,resetSearchQuery } = useSearchDictionaryWord();
  const location = useLocation();

  // 認証状態を確認する関数
  const authentication = (currentPath: string) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      return (
        <div className='login'>
        {currentPath === '/Create' ? (
          <Link to="/EditDictionary" className='header-home-button'>管理画面</Link>
        ) : (
          <Link to="/Create" className='header-home-button'>投稿する</Link>
        )}
        <SignOut/>
      </div>
      );
    } else {
      return (
        <Link to="/SignIn" className='header-home-button'>ログイン</Link>
      );
    }
  };

  return (
    <header className='header-header'>
      <Link to="/" className='header-home-button' onClick={resetSearchQuery} >ホームボタン</Link>
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
      {authentication(location.pathname)}
    </header>
  );
};

export default Header;