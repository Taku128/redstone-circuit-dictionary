import React from 'react';
import EditAccordionPanel from './EditAccordionPanel';

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
  responseMessage: string;
}

const EditDictionaryItem: React.FC<EditDictionaryItemComponentProps> = ({ item, onDelete, onEdit, responseMessage }) => {
  const parsedCategories: string[] = JSON.parse(item.category_json);
  const parsedImageUrls: string[] = JSON.parse(item.video_json);

  const handleDelete = (id: number, poster: string) => {
    onDelete(id, poster);
  };

  const handleEdit = (id: number, poster: string, updatedData: { word: string; categories: string[]; videos: string[]; description: string; }) => {
    onEdit(id,poster,updatedData)
  };

  return (
    <EditAccordionPanel
      ID={item.id}
      Word={item.word}
      Categories={parsedCategories}
      Videos={parsedImageUrls}
      Description={item.description}
      CreatedAt={item.created_at} 
      Poster={item.poster}
      onDelete={() => handleDelete(item.id,item.poster)}
      onEdit={handleEdit} 
      ResponseMessage={responseMessage}
    />
  );
};

export default EditDictionaryItem;
