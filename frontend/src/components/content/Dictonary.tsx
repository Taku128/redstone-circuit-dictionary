import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DictionaryItem, { DictionaryItemProps } from './DictonaryItem';
import '../css/Dictionary.css';

const Dictionary: React.FC = () => {
    const [dictionary, setDictionary] = useState<DictionaryItemProps[]>([]);
  
    useEffect(() => {
        // Replace 'your_lambda_url' with the actual URL of your AWS Lambda function
        axios.get<DictionaryItemProps[]>('https://u4dokqntp1.execute-api.ap-northeast-1.amazonaws.com/dev/dictionary')
          .then((response: { data: DictionaryItemProps[] }) => setDictionary(response.data))
          .catch((error : any)=> console.error('Error fetching data: ', error));
    }, []);
  
    return (
      <div className="Dictionary">
        <div className="dictionary-list">
          {dictionary.map((item, index) => (
            <DictionaryItem key={index} item={item} />
          ))}
        </div>
      </div>
    );
};
  
export default Dictionary;
