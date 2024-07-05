import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DictionaryItem, { DictionaryItemProps } from './DictonaryItem';
import '../css/Dictionary.css';

const Dictionary: React.FC = () => {
  const [dictionary, setDictionary] = useState<DictionaryItemProps[]>([]);
  const [groupedDictionary, setGroupedDictionary] = useState<{ [key: string]: DictionaryItemProps[] }>({});

  useEffect(() => {
    // Replace 'your_lambda_url' with the actual URL of your AWS Lambda function
    axios.get<DictionaryItemProps[]>('https://u4dokqntp1.execute-api.ap-northeast-1.amazonaws.com/dev/dictionary')
      .then((response: { data: DictionaryItemProps[] }) => {
        const sortedData = response.data.sort((a, b) => a.word.localeCompare(b.word));
        setDictionary(sortedData);
      })
      .catch((error: any) => console.error('Error fetching data: ', error));
  }, []);

  useEffect(() => {
    const groupedData = dictionary.reduce((acc, item) => {
      const firstLetter = item.word[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(item);
      return acc;
    }, {} as { [key: string]: DictionaryItemProps[] });

    setGroupedDictionary(groupedData);
  }, [dictionary]);

  return (
    <div className="Dictionary">
      <div className="dictionary-list">
        {Object.keys(groupedDictionary).map((letter) => (
          <React.Fragment key={letter}>
            <h2 className='dictionary-list-h2'>{letter}</h2>
            <div className='dictionary-list-border'></div>
            {groupedDictionary[letter].map((item, index) => (
              <DictionaryItem key={index} item={item} />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Dictionary;
