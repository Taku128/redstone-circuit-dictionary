import { useState } from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';
import awsConfiguration from '../../../awsConfiguration';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

const useSignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(null);

  const validateInputs = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    return true;
  };

  const signIn = (location: string) => {
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
        const accessToken = result.getAccessToken().getJwtToken();
        setEmail('');
        setPassword('');
        setError('');
        window.location.href = location;
      },
      onFailure: (err) => {
        setError(err.message || JSON.stringify(err));
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        setShowNewPassword(true);
        setCognitoUser(user);
        setError('New password required. Please set a new password.');
      }
    });
  };

  const handleNewPassword = (location: string) => {
    if (!newPassword) {
      setError('New password is required');
      return;
    }

    if (cognitoUser) {
      cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
        onSuccess: (result) => {
          const accessToken = result.getAccessToken().getJwtToken();
          setEmail('');
          setPassword('');
          setNewPassword('');
          setShowNewPassword(false);
          setError('');
          window.location.href = location;
        },
        onFailure: (err) => {
          setError(err.message || JSON.stringify(err));
        },
      });
    }
  };

  return {
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
  };
};

export default useSignIn;
