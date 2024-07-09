import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import awsConfiguration from '../../../awsConfiguration';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

const useSignOut = () => {
  const location = useLocation();

  useEffect(() => {
    const signOut = () => {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut();
        localStorage.clear();
        console.log('signed out');
        window.location.href = location.pathname;
      } else {
        localStorage.clear();
        console.log('no user signing in');
      }
    };

    return signOut;
  }, [location.pathname]);

  return null;
};

export default useSignOut;
