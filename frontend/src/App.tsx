import React from 'react';
import './App.css';
import RouterComponent from './routes/Router';
import { BrowserRouter } from 'react-router-dom';
import Header from './features/Header/components/Header';

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

