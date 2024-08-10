import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateDictionary from '../features/Dictionary/pages/CreateDictionaryPage';
import SignUp from '../features/Auth/pages/SignUp/SignUpPage';
import SignIn from '../features/Auth/pages/SignIn/SignInPage';
import Dictionary from '../features/Dictionary/pages/DictionaryPage';

const RouterComponent: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Dictionary />} />
        <Route path='/Create' element={<CreateDictionary />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/SignIn' element={<SignIn />} />
        <Route path='*' element={<Dictionary />} />
      </Routes>
    </div>
  );
};

export default RouterComponent;
