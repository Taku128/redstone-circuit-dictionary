import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateDictionary from '../features/Dictionary/pages/CreateDictionaryPage';
import SignUp from '../features/Auth/pages/SignUp/SignUpPage';
import SignIn from '../features/Auth/pages/SignIn/SignInPage';
import Dictionary from '../features/Dictionary/pages/DictionaryPage';
import EditDictionary from '../features/Dictionary/pages/EditDictionaryPage';
import SignOut from '../features/Auth/pages/SignOut/SignOutPage';
import CommunityPage from '../features/Community/pages/CommunityPage';

const RouterComponent: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<CommunityPage />} />
      <Route path='/Create' element={<CreateDictionary />} />
      <Route path='/SignUp' element={<SignUp />} />
      <Route path='/SignOut' element={<SignOut />} />
      <Route path='/SignIn' element={<SignIn />} />
      <Route path='/EditDictionary' element={<EditDictionary />} />
      <Route path='/Dictonary' element={<Dictionary />} />
      <Route path='*' element={<CommunityPage />} />
    </Routes>
  );
};

export default RouterComponent;
