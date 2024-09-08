import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CognitoUserPool,CognitoUserSession } from 'amazon-cognito-identity-js';
import axios from 'axios';
import awsConfiguration from '../../../awsConfiguration';
import { EditDictionaryItemProps } from '../components/EditDictionaryItem';
import endpoint from '../../../endpoint';

const userPool = new CognitoUserPool({
    UserPoolId: awsConfiguration.UserPoolId,
    ClientId: awsConfiguration.ClientId,
  });

const useEditDictionaryData = () => {
  const location = useLocation(); 
  const [dictionary, setDictionary] = useState<EditDictionaryItemProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        var username: string = '';
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
            username = cognitoUser.getUsername();
            }
            else {
            console.log('Session Is Not Valid');
            return;
            }
        } catch (error) {
            console.error('Error getting user session', error);
            return;
        }
        } 
        if (!username){
        console.log('No cognito user found');
        return
        }

        if (location.state && location.state.results) {
            const searchResults = location.state.results as EditDictionaryItemProps[];
            setDictionary(searchResults);
        } else {
            try {
                const response = await axios.get<EditDictionaryItemProps[]>(endpoint + `/dev/dictionary/?poster=${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-processing-type1': 'dictionary_word',
                        'x-processing-type2': 'get_poster_dictionary_word',
                    },
                });
                const sortedData = response.data.sort((a, b) => a.word.localeCompare(b.word));
                setDictionary(sortedData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
    };

    fetchData();
  }, [location.state]);

  return dictionary;
};

export default useEditDictionaryData;
