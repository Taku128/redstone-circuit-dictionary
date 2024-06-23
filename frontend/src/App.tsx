import React from 'react';
import './App.css';
import RouterComponent from './components/Router';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';

function App() {
  const basePath = process.env.PUBLIC_URL || "/";

  return (
    <BrowserRouter basename={basePath}>
      <Header/>
      <RouterComponent/>
    </BrowserRouter>
  );
}

export default App;

