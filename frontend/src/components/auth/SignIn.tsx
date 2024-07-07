import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';
import awsConfiguration from '../../awsConfiguration';
import "../css/SignIn.css";

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

const SignIn: React.FC = () => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [newPassword, setNewPassword] = React.useState<string>('');
  const [showNewPassword, setShowNewPassword] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [cognitoUser, setCognitoUser] = React.useState<CognitoUser | null>(null);
  const location = useLocation();

  const changedEmailHandler = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const changedPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const changedNewPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);

  const validateInputs = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    return true;
  };

  const signIn = () => {
    if (!validateInputs()) return;

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    user.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('result: ' + result);
        const accessToken = result.getAccessToken().getJwtToken();
        console.log('AccessToken: ' + accessToken);
        setEmail('');
        setPassword('');
        setError('');
        window.location.href = location.pathname;
      },
      onFailure: (err) => {
        setError(err.message || JSON.stringify(err));
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        // Handle the new password requirement
        setShowNewPassword(true);
        setCognitoUser(user); // Store the cognitoUser instance for reuse
        setError('New password required. Please set a new password.');
      }
    });
  };

  const handleNewPassword = () => {
    if (!newPassword) {
      setError('New password is required');
      return;
    }

    if (cognitoUser) {
      cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
        onSuccess: (result) => {
          console.log('Password reset successful: ' + result);
          const accessToken = result.getAccessToken().getJwtToken();
          console.log('AccessToken: ' + accessToken);
          setEmail('');
          setPassword('');
          setNewPassword('');
          setShowNewPassword(false);
          setError('');
          window.location.href = location.pathname;
        },
        onFailure: (err) => {
          setError(err.message || JSON.stringify(err));
        },
      });
    }
  };

  return (
    <div className="SignIn">
      <h1>Sign In</h1>
      <input type="text" placeholder="email" value={email} onChange={changedEmailHandler} />
      <input type="password" placeholder="password" value={password} onChange={changedPasswordHandler} />
      {showNewPassword && (
        <>
          <input type="password" placeholder="new password" value={newPassword} onChange={changedNewPasswordHandler} />
          <button onClick={handleNewPassword}>Set New Password</button>
        </>
      )}
      {error && <div className="error">{error}</div>}
      {!showNewPassword && <button onClick={signIn}>Sign In</button>}
      <p>アカウント作成は以下から</p>
      <Link className="link-button" to="/SignUp">Sign Up</Link>
    </div>
  );
};

export default SignIn;
