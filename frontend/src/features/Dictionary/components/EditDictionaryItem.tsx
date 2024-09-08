import React from 'react';
import './DictionaryItem.css';
import EditAccordionPanel from './EditAccordionPanel';
import useDeleteDictionaryData from '../hooks/useDeleteDictionary';

export interface EditDictionaryItemProps {
  Number: number;
  word: string;
  description: string;
  category: string; 
  video: string; 
  poster: string;
  created_at: string;
  onDelete: (id: number, poster: string) => void; 
  onEdit: (id: number, updatedData: { word: string; categories: string[]; imageUrls: string[]; description: string; created_at: string }) => void;
}

interface EditDictionaryItemComponentProps {
  item: EditDictionaryItemProps;
  onDelete: (id: number, poster: string) => void;
  onEdit: (id: number, updatedData: { word: string; categories: string[]; imageUrls: string[]; description: string; created_at: string }) => void;
}

const EditDictionaryItem: React.FC<EditDictionaryItemComponentProps> = ({ item, onDelete, onEdit }) => {
  const { deleteDictionaryData } = useDeleteDictionaryData();

  const parsedCategories: string[] = JSON.parse(item.category);
  const parsedImageUrls: string[] = JSON.parse(item.video);

  const handleDelete = async (id: number, poster: string) => {
    await deleteDictionaryData(id,poster, () => {
      onDelete(id, poster);
    });
  };

  const handleEdit = (id: number, updatedData: { word: string; categories: string[]; imageUrls: string[]; description: string; created_at: string }) => {
    onEdit(id, updatedData);
  };

  return (
    <EditAccordionPanel
      id={item.Number}
      word={item.word}
      category={parsedCategories}
      video={parsedImageUrls}
      description={item.description}
      created_at={item.created_at} // Pass created_at to EditAccordionPanel
      poster={item.poster}
      onDelete={() => handleDelete(item.Number,item.poster)}
      onEdit={handleEdit} // Pass the handleEdit function
    />
  );
};

export default EditDictionaryItem;
