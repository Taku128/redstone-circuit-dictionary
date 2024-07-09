import React from 'react';
import SignOut from './../pages/SignOut/SignOutPage';
import SignIn from './../pages/SignIn/SignInPage';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import awsConfiguration from '../../../awsConfiguration';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

const Authentication: React.FC = () => {
  const cognitoUser = userPool.getCurrentUser();

  if (cognitoUser) {
    return (
      <div className="authorizedMode">
        <SignOut />
      </div>
    );
  } else {
    return (
      <div className="unauthorizedMode">
        <SignIn />
      </div>
    );
  }
};

export default Authentication;
