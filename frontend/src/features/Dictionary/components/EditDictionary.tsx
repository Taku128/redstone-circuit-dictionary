import React, { useState, useEffect } from 'react';
import useEditDictionaryData from '../hooks/useEditDictionaryData';
import useDeleteDictionaryData from '../hooks/useDeleteDictionary';
import EditDictionaryItem, { EditDictionaryItemProps } from './EditDictionaryItem';
import Separator from './Separator';
import './EditDictionary.css';

const EditDictionary: React.FC = () => {
    const dictionary = useEditDictionaryData();
    const [groupedDictionary, setGroupedDictionary] = useState<{ [key: string]: EditDictionaryItemProps[] }>({});
    const { deleteDictionaryData, responseMessage } = useDeleteDictionaryData();

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
      }, {} as { [key: string]: EditDictionaryItemProps[] });
  
      setGroupedDictionary(groupedData);
    }, [dictionary]);


    const handleDelete = (id: number) => {
      deleteDictionaryData(id, () => {
        // 削除が成功した後に辞書データを更新する
        const updatedDictionary = dictionary.filter(item => item.Number !== id);
        setGroupedDictionary(
          updatedDictionary.reduce((acc, item) => {
            const firstLetter = item.word[0].toUpperCase();
            if (!acc[firstLetter]) {
              acc[firstLetter] = [];
            }
            acc[firstLetter].push(item);
            return acc;
          }, {} as { [key: string]: EditDictionaryItemProps[] })
        );
      });
    };
  
    return (
      <div className='home'>
        <h1 className="font-ubuntu-medium">
            管理画面
        </h1>
        <div className="Dictionary">
            <div className="dictionary-list">
            {Object.keys(groupedDictionary).map((letter) => (
                <React.Fragment key={letter}>
                <h2 className='dictionary-list-h2'>{letter}</h2>
                {groupedDictionary[letter].map((item, idx) => (
                    <div key={item.word + idx}>
                    {idx > 0 && <Separator />}
                    <EditDictionaryItem key={item.word} item={item} onDelete={handleDelete} />
                    </div>
                ))}
                </React.Fragment>
            ))}
            </div>
        </div>
      </div>
    );
  };
  
  export default EditDictionary;