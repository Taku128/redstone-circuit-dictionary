import React from 'react';
import { Link } from 'react-router-dom';

interface SignInFormProps {
  email: string;
  password: string;
  newPassword: string;
  showNewPassword: boolean;
  error: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignIn: () => void;
  onSetNewPassword: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  email,
  password,
  newPassword,
  showNewPassword,
  error,
  onEmailChange,
  onPasswordChange,
  onNewPasswordChange,
  onSignIn,
  onSetNewPassword,
}) => (
  <div className="SignIn">
    <h1>Sign In</h1>
    <input type="text" placeholder="email" value={email} onChange={onEmailChange} />
    <input type="password" placeholder="password" value={password} onChange={onPasswordChange} />
    {showNewPassword && (
      <>
        <input type="password" placeholder="new password" value={newPassword} onChange={onNewPasswordChange} />
        <button onClick={onSetNewPassword}>Set New Password</button>
      </>
    )}
    {error && <div className="error">{error}</div>}
    {!showNewPassword && <button onClick={onSignIn}>Sign In</button>}
    <p>アカウント作成は以下から</p>
    <Link className="link-button" to="/SignUp">Sign Up</Link>
  </div>
);

export default SignInForm;
