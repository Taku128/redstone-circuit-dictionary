import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreatDictonary from './content/CreatDictonary';
import SignUp from './auth/SignUp';
import Verification from './auth/Verification';
import SignIn from './auth/SignIn';
import Home from './Home';
import SignOut from './auth/SignOut';
import Login from './login';

const RouterComponent: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Creat' element={<CreatDictonary/>}/>
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/Verification' element={<Verification/>}/>
        <Route path='/SignIn' element={<SignIn/>}/>
        <Route path='/SignOut' element={<SignOut/>}/>
        <Route path='/Login' element={<Login/>}/>
      </Routes>
    </div>
  );
};

export default RouterComponent;
