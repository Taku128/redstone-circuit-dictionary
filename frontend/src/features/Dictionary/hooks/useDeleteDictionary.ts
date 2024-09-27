import { useEffect, useState, useCallback } from 'react';
import { CognitoUserPool,CognitoUserSession } from 'amazon-cognito-identity-js';
import useFetchAuthSession from '../hooks/useFetchAuthSession';
import awsConfiguration from '../../../awsConfiguration';
import endpoint from '../../../endpoint';

const userPool = new CognitoUserPool({
    UserPoolId: awsConfiguration.UserPoolId,
    ClientId: awsConfiguration.ClientId,
  });

const useDeleteDictionaryData = () => {
  const [responseMessage, setResponseMessage] = useState('');
  const [session, setSession] = useState<CognitoUserSession | null>(null);

        useEffect(() => {
          const FetchSession = async () => {
            const fetchedSession = await useFetchAuthSession(userPool);
            setSession(fetchedSession);
          };
          
          FetchSession();
        }, []);

  const deleteDictionaryData = useCallback(async (id: number, poster: string, onSuccess: () => void) => {
        let username = '';
        let cognitoSession = '';

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
        const dictionary = {
          poster: poster,
        }

        const requestBody = {
          action_user: username,
          cognito_session: cognitoSession,
          dictionary_word: dictionary
        };

        try {
            const response = await fetch(endpoint + `/dev/dictionary/${id}`, {
              credentials: 'include',
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session}`,
                'x-processing-type1': 'dictionary_word',
                'x-processing-type2': 'delete_dictionary_word',
              },
              body : JSON.stringify(requestBody),
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
