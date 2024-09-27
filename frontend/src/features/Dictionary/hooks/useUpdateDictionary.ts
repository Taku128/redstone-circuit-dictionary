import { useEffect, useState, useCallback } from 'react';
import { CognitoUserPool,CognitoUserSession } from 'amazon-cognito-identity-js';
import useFetchAuthSession from '../hooks/useFetchAuthSession';
import awsConfiguration from '../../../awsConfiguration';
import endpoint from '../../../endpoint';
import { UpdateDictionaryItemProps } from '../components/EditDictionary';

const userPool = new CognitoUserPool({
    UserPoolId: awsConfiguration.UserPoolId,
    ClientId: awsConfiguration.ClientId,
  });

const useUpdateDictionaryData = () => {
  const [responseMessage, setResponseMessage] = useState('');
  const [session, setSession] = useState<CognitoUserSession | null>(null);

        useEffect(() => {
          const FetchSession = async () => {
            const fetchedSession = await useFetchAuthSession(userPool);
            setSession(fetchedSession);
          };
          
          FetchSession();
        }, []);

  const updateDictionaryData = useCallback(async (id: number, poster: string,input: UpdateDictionaryItemProps , onSuccess: () => void) => {
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
          word:input.word,
          description:input.description,
          category_json:input.category_json,
          video_json:input.video_json,
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
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session}`,
                'x-processing-type1': 'dictionary_word',
                'x-processing-type2': 'update_dictionary_word',
              },
              body : JSON.stringify(requestBody),
            });
      
            if (!response.ok) {
              const errorText = await response.text();
              console.error('Error update data', errorText);
              throw new Error(`Error update data: ${errorText}`);
            }
            setResponseMessage('Data update successfully');
          } catch (error) {
            console.error('Failed to fetch', error);
            setResponseMessage('Error: ' + error);
        }
    }, []);

    return { updateDictionaryData, responseMessage };
};

export default useUpdateDictionaryData;
