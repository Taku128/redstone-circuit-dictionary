import { CognitoUserSession } from 'amazon-cognito-identity-js';

const useFetchAuthSession = async (userPool: any) => {
  const cognitoUser = userPool.getCurrentUser();
  
  if (!cognitoUser) return null;

  return new Promise<CognitoUserSession | null>((resolve, reject) => {
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err) reject(err);
      else resolve(session);
    });
  });
};

export default useFetchAuthSession;
