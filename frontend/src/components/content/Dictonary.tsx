import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DictionaryItem, { DictionaryItemProps } from './DictionaryItem';
import Separator from './Separator';
import '../css/Dictionary.css';

const Dictionary: React.FC = () => {
  const location = useLocation();
  const [dictionary, setDictionary] = useState<DictionaryItemProps[]>([]);
  const [groupedDictionary, setGroupedDictionary] = useState<{ [key: string]: DictionaryItemProps[] }>({});

  useEffect(() => {
    // Check if there are search results passed through the location state
    if (location.state && location.state.results) {
      const searchResults = location.state.results as DictionaryItemProps[];
      setDictionary(searchResults);
    } else {
      // Fetch all data if no search results are passed
      axios.get<DictionaryItemProps[]>('https://u4dokqntp1.execute-api.ap-northeast-1.amazonaws.com/dev/dictionary')
        .then((response: { data: DictionaryItemProps[] }) => {
          const sortedData = response.data.sort((a, b) => a.word.localeCompare(b.word));
          setDictionary(sortedData);
        })
        .catch((error: any) => console.error('Error fetching data: ', error));
    }
  }, [location.state]);

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
            {groupedDictionary[letter].map((item, idx) => (
              <div key={item.word + idx}>
                {idx > 0 && <Separator />}
                <DictionaryItem key={item.word} item={item} />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Dictionary;
