import React from 'react';
import useSignOut from '../hooks/useSignOut';
import '../../../css/SignOut.css';

const SignOutButton: React.FC = () => {
  useSignOut();

  return (
    <div className="SignOut">
      <h1>SignOut</h1>
      <button>Sign Out</button>
    </div>
  );
};

export default SignOutButton;
