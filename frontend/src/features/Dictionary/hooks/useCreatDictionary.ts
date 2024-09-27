import { useEffect, useState } from 'react';
import { CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import endpoint from '../../../endpoint';
import UseFetchAuthSession from '../hooks/useFetchAuthSession';
import awsConfiguration from '../../../awsConfiguration';
import { DictionaryWordFormData } from '../pages/CreateDictionaryPage';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

const useDictionarySubmit = (onSuccess: () => void) => {
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [session, setSession] = useState<CognitoUserSession | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const fetchedSession = await UseFetchAuthSession(userPool);
      setSession(fetchedSession);
    };
    fetchSession();
  }, []);

  const handleSubmit = async (input: DictionaryWordFormData) => {
    // 実行ユーザの確認、username、cognitoSessionの取得
    var username: string = '';
    var cognitoSession: string = '';
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

    const dictionaryWord = {
      ...input,
      poster: username,
    };

    // 実行ユーザとSessionの情報を追加、バックエンドでの検証用
    const requestBody = {
      action_user: username,
      cognito_session: cognitoSession,
      dictionary_word: dictionaryWord,
    };

    try {
      const response = await fetch(`${endpoint}/dev/dictionary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session}`,
          'x-processing-type1': 'dictionary_word',
          'x-processing-type2': 'create_dictionary_word',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error saving data', errorText);
        throw new Error(`Error saving data: ${errorText}`);
      }

      onSuccess();
      console.log('Data saved successfully');
      setResponseMessage('Data saved successfully');
    } catch (error) {
      console.error('Failed to fetch', error);
      setResponseMessage('Error: ' + error);
    }
  };

  const clearResponseMessage = () => {
    setResponseMessage('');
  };

  return { handleSubmit, responseMessage, clearResponseMessage };
};

export default useDictionarySubmit;
