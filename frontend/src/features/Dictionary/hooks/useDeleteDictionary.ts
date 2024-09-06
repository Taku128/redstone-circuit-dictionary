import { useState, useCallback } from 'react';
import { CognitoUserPool,CognitoUserSession } from 'amazon-cognito-identity-js';
import UseFetchAuthSession from '../hooks/useFetchAuthSession';
import awsConfiguration from '../../../awsConfiguration';

const userPool = new CognitoUserPool({
    UserPoolId: awsConfiguration.UserPoolId,
    ClientId: awsConfiguration.ClientId,
  });

const useDeleteDictionaryData = () => {
  const [responseMessage, setResponseMessage] = useState('');

  const deleteDictionaryData = useCallback(async (id: number, onSuccess: () => void) => {
        let username = '';
        let cognitoSession = '';
        const action = "delete_dictionary_word";
        const actionType = "dictionary_word";

        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
            try {
              const session = await new Promise<CognitoUserSession>((resolve, reject) => {
                cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
                  if (err) {
                    reject(err);
                  } else if (session) {
                    resolve(session);
                  } else {
                    reject(new Error('Failed Get Session'));
                  }
                });
              });
      
              if (session.isValid()) {
                cognitoSession = session.getAccessToken().getJwtToken();
                username = cognitoUser.getUsername();
              }
              else {
                console.log('Session Is Not Valid');
                return;
              }
            } catch (error) {
              console.error('Error getting user session', error);
              setResponseMessage('Failed Get User');
              return;
            }
          } 
          if (!username){
            console.log('No cognito user found');
            setResponseMessage('No Cognito user found');
            return
        }

        try {
            const token = await UseFetchAuthSession();
            const response = await fetch(`https://c3gfeuoxd5.execute-api.ap-northeast-1.amazonaws.com/dev/dictionary/?id=${id}&action=${action}&action_type=${actionType}&poster=${username}&cognito_session=${cognitoSession}`, {
              credentials: 'include',
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });
      
            if (!response.ok) {
              const errorText = await response.text();
              console.error('Error delete data', errorText);
              throw new Error(`Error delete data: ${errorText}`);
            }
            setResponseMessage('Data delete successfully');
            onSuccess();
          } catch (error) {
            console.error('Failed to fetch', error);
            setResponseMessage('Error: ' + error);
        }
    }, []);

    return { deleteDictionaryData, responseMessage };
};

export default useDeleteDictionaryData;
