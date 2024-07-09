import React from 'react';
import useSignUp from '../hooks/useSignUp';
import '../../../css/SignUp.css';

const SignUpForm: React.FC = () => {
  const {
    email,
    password,
    error,
    changedEmailHandler,
    changedPasswordHandler,
    signUp,
  } = useSignUp();

  return (
    <div className="SignUp">
      <h1 style={{ textAlign: 'left' }}>SignUp</h1>
      <p>※パスワードは他のアカウントとは別のものを使用してください!</p>
      <input type="text" placeholder="email" onChange={changedEmailHandler} />
      <input type="password" placeholder="password" onChange={changedPasswordHandler} />
      {error && <div className="error">{error}</div>}
      <button onClick={signUp}>SignUp</button>
    </div>
  );
};

export default SignUpForm;
