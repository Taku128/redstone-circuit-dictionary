import React, { useState, useEffect } from 'react';
import useEditDictionaryData from '../hooks/useEditDictionaryData';
import useDeleteDictionaryData from '../hooks/useDeleteDictionary';
import EditDictionaryItem, { EditDictionaryItemProps } from '../components/EditDictionaryItem';
import Separator from '../components/Separator';
import './EditDictionaryPage.css';
import useUpdateDictionaryData from '../hooks/useUpdateDictionary';

export interface UpdateDictionaryItemProps {
  word: string;
  description: string;
  category_json: string; 
  video_json: string; 
}

const EditDictionary: React.FC = () => {
  const { dictionary, fetchData } = useEditDictionaryData(); // Fetch dictionary data with hook
  const [groupedDictionary, setGroupedDictionary] = useState<{ [key: string]: EditDictionaryItemProps[] }>({});
  const { deleteDictionaryData } = useDeleteDictionaryData();
  const { updateDictionaryData, responseMessage } = useUpdateDictionaryData();

  // Fetch and group dictionary data when `dictionary` or `refresh` changes
  useEffect(() => {
    if (dictionary.length === 0) return;

    const groupedData = dictionary.reduce((acc, item) => {
      if (item.word && typeof item.word === 'string') {
        const firstLetter = item.word[0].toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(item);
      } else {
        console.warn(`Invalid item encountered:`, item);
      }
      return acc;
    }, {} as { [key: string]: EditDictionaryItemProps[] });

    setGroupedDictionary(groupedData);
  }, [dictionary]); // Refresh effect when dictionary or refresh state changes

  const handleDelete = async (id: number,poster: string) => {
    await deleteDictionaryData(id,poster, () => {
      const updatedDictionary = dictionary.filter(item => item.id !== id);
      setGroupedDictionary(
        updatedDictionary.reduce((acc, item) => {
          if (item.word && typeof item.word === 'string') {
            const firstLetter = item.word[0].toUpperCase();
            if (!acc[firstLetter]) {
              acc[firstLetter] = [];
            }
            acc[firstLetter].push(item);
          } else {
            console.warn(`Invalid item encountered:`, item);
          }
          return acc;
        }, {} as { [key: string]: EditDictionaryItemProps[] })
      );
    });
  };

  // Handle edit and trigger refresh
  const handleEdit = async (id: number, poster: string, updatedData: { word: string; categories: string[]; videos: string[]; description: string; }) => {
    const updatedFormData: UpdateDictionaryItemProps = {
      word: updatedData.word,
      description: updatedData.description,
      category_json: JSON.stringify(updatedData.categories.filter(category => category.trim() !== '')),
      video_json: JSON.stringify(updatedData.videos.filter(video => video.trim() !== '')),
    };
    await updateDictionaryData(id, poster, updatedFormData, () => {
      fetchData();
    });
  };

  return (
    <div className='home'>
      <h1 className="font-ubuntu-medium">管理画面</h1>
      <div className="Dictionary">
        <div className="dictionary-list">
          {Object.keys(groupedDictionary).map((letter) => (
            <React.Fragment key={letter}>
              <h2 className='dictionary-list-h2'>{letter}</h2>
              {groupedDictionary[letter].map((item, idx) => (
                <div key={item.id + idx}>
                  {idx > 0 && <Separator />}
                  <EditDictionaryItem 
                    key={item.id} 
                    item={item} 
                    onDelete={handleDelete} 
                    onEdit={handleEdit}
                    responseMessage = {responseMessage}
                  />
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
