import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreatDictonary from './content/CreatDictonary';
import Home from './Home';

const RouterComponent: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Creat' element={<CreatDictonary/>}/>
      </Routes>
    </div>
  );
};

export default RouterComponent;
