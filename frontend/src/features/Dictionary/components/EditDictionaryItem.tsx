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
  onDelete: (id: number) => void; 
  onEdit: (id: number) => void;
}

interface EditDictionaryItemComponentProps {
  item: EditDictionaryItemProps;
}


const EditDictionaryItem: React.FC<EditDictionaryItemComponentProps> = ({ item }) => {
    const { deleteDictionaryData } = useDeleteDictionaryData();

    const parsedCategories: string[] = JSON.parse(item.category);
    const parsedImageUrls: string[] = JSON.parse(item.video);

    const handleDelete = (id: number) => {
        deleteDictionaryData(id); 
    };

    const handleEdit = (id: number) => {
        console.log("Edit panel with ID:", id);
        // Additional logic for editing can go here
    };

    return (
        <EditAccordionPanel
        id={item.Number}
        title={item.word}
        categories={parsedCategories}
        imageUrls={parsedImageUrls}
        description={item.description}
        createdAt={item.created_at}
        onDelete={handleDelete}
        onEdit={handleEdit}
        />
    );
};

export default EditDictionaryItem;
