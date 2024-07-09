import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CognitoUserPool,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import awsConfiguration from '../../../awsConfiguration';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

const useVerification = () => {
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const changedEmailHandler = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const changedVerificationCodeHandler = (event: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(event.target.value);

  const verifyCode = () => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });
    cognitoUser.confirmRegistration(verificationCode, true, (err: Error | undefined) => {
      if (err) {
        setError(err.message || JSON.stringify(err));
        return;
      }
      console.log('Verification succeeded');
      setEmail('');
      setVerificationCode('');
      setError('');
      navigate('/Create');
    });
  };

  return {
    email,
    verificationCode,
    error,
    changedEmailHandler,
    changedVerificationCodeHandler,
    verifyCode,
  };
};

export default useVerification;
