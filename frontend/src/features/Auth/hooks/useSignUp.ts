import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';
import awsConfiguration from '../../../awsConfiguration';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

const useSignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const changedEmailHandler = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const changedPasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  const signUp = () => {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
    ];

    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        setError(err.message || JSON.stringify(err));
        return;
      }
      setError('');
      setEmail('');
      setPassword('');
      navigate('/Verification');
    });
  };

  return {
    email,
    password,
    error,
    changedEmailHandler,
    changedPasswordHandler,
    signUp,
  };
};

export default useSignUp;
