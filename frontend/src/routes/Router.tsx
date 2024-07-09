import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateDictionary from '../features/Dictionary/pages/CreatDictionaryPage'; // Corrected component name
import SignUp from '../features/Auth/pages/SignUp/SignUpPage';
import Verification from '../features/Auth/pages/Verification/VerificationPage';
import SignIn from '../features/Auth/pages/SignIn/SignInPage';
import Dictionary from '../features/Dictionary/pages/DictionaryPage';

const RouterComponent: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Dictionary />} />
        <Route path='/Creat' element={<CreateDictionary />} /> {/* Corrected path name */}
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/Verification' element={<Verification />} />
        <Route path='/SignIn' element={<SignIn />} />
        <Route path='*' element={<Dictionary />} /> {/* Fallback route */}
      </Routes>
    </div>
  );
};

export default RouterComponent;
