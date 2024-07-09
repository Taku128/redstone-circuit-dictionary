import React from 'react';
import { useLocation } from 'react-router-dom';
import useSignIn from '../../hooks/useSignIn';
import SignInForm from '../../components/SignInForm';
import "./SignInPage.css";

const SignIn: React.FC = () => {
  const {
    email,
    password,
    newPassword,
    showNewPassword,
    error,
    setEmail,
    setPassword,
    setNewPassword,
    signIn,
    handleNewPassword,
  } = useSignIn();
  
  const location = useLocation();

  const changedEmailHandler = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const changedPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const changedNewPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);

  return (
    <SignInForm
      email={email}
      password={password}
      newPassword={newPassword}
      showNewPassword={showNewPassword}
      error={error}
      onEmailChange={changedEmailHandler}
      onPasswordChange={changedPasswordHandler}
      onNewPasswordChange={changedNewPasswordHandler}
      onSignIn={() => signIn(location.pathname)}
      onSetNewPassword={() => handleNewPassword(location.pathname)}
    />
  );
};

export default SignIn;
