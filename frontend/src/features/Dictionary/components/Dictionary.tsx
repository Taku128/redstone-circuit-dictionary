import React, { useState, useEffect } from 'react';
import useDictionaryData from '../hooks/useDictionaryData';
import DictionaryItem, { DictionaryItemProps } from './DictionaryItem';
import Separator from './Separator';
import './Dictionary.css';

const Dictionary: React.FC = () => {
    const dictionary = useDictionaryData();
    const [groupedDictionary, setGroupedDictionary] = useState<{ [key: string]: DictionaryItemProps[] }>({});
  
    useEffect(() => {
      if (dictionary.length === 0) return;

      console.log(dictionary)
  
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