import React from 'react';
import EditAccordionPanel from './EditAccordionPanel';
import useDeleteDictionaryData from '../hooks/useDeleteDictionary';
import useUpdateDictionaryData from '../hooks/useUpdateDictionary';
import { UpdateDictionaryItemProps } from './EditDictionary';

export interface EditDictionaryItemProps {
  id: number;
  word: string;
  description: string;
  category_json: string; 
  video_json: string; 
  poster: string;
  created_at: string;
  onDelete: (id: number, poster: string) => void; 
  onEdit: (id: number, poster: string, updatedData: { word: string; categories: string[]; videos: string[]; description: string; }) => void;
}

interface EditDictionaryItemComponentProps {
  item: EditDictionaryItemProps;
  onDelete: (id: number, poster: string) => void;
  onEdit: (id: number, poster: string, updatedData: { word: string; categories: string[]; videos: string[]; description: string; }) => void;
}

const EditDictionaryItem: React.FC<EditDictionaryItemComponentProps> = ({ item, onDelete, onEdit }) => {
  const { deleteDictionaryData } = useDeleteDictionaryData();
  const { updateDictionaryData, responseMessage } = useUpdateDictionaryData();

  const parsedCategories: string[] = JSON.parse(item.category_json);
  const parsedImageUrls: string[] = JSON.parse(item.video_json);

  const handleDelete = async (id: number, poster: string) => {
    await deleteDictionaryData(id,poster, () => {
      onDelete(id, poster);
    });
  };

  const handleEdit = async (id: number, poster: string, updatedData: { word: string; categories: string[]; videos: string[]; description: string; }) => {
    const updatedFormData: UpdateDictionaryItemProps = {
      word: updatedData.word,
      description: updatedData.description,
      category_json: JSON.stringify(updatedData.categories.filter(category => category.trim() !== '')),
      video_json: JSON.stringify(updatedData.videos.filter(video => video.trim() !== '')),
    };
    
    await updateDictionaryData(id,poster,updatedFormData,() =>{
      onEdit(id,poster,updatedData)
    });
  };

  return (
    <EditAccordionPanel
      ID={item.id}
      Word={item.word}
      Categories={parsedCategories}
      Videos={parsedImageUrls}
      Description={item.description}
      CreatedAt={item.created_at} // Pass created_at to EditAccordionPanel
      Poster={item.poster}
      onDelete={() => handleDelete(item.id,item.poster)}
      onEdit={handleEdit} // Pass the handleEdit function
    />
  );
};

export default EditDictionaryItem;
