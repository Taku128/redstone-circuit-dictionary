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

const useDictionarySubmit = (resetForm: () => void) => {
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [session, setSession] = useState<CognitoUserSession | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const fetchedSession = await UseFetchAuthSession(userPool);
      setSession(fetchedSession);
    };
    fetchSession();
  }, []);

  const handleSubmit = async (requestBody: DictionaryWordFormData) => {

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

      resetForm();
      console.log('Data saved successfully');
      setResponseMessage('Data saved successfully');
    } catch (error) {
      console.error('Failed to fetch', error);
      setResponseMessage('Error: ' + error);
    }
  };

  return { handleSubmit, responseMessage };
};

export default useDictionarySubmit;
