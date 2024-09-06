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
  onDelete: (id: number) => void; // ここを追加
}


const EditDictionaryItem: React.FC<EditDictionaryItemComponentProps> = ({  item, onDelete }) => {
    const { deleteDictionaryData } = useDeleteDictionaryData();

    const parsedCategories: string[] = JSON.parse(item.category);
    const parsedImageUrls: string[] = JSON.parse(item.video);

    const handleDelete = async (id: number) => {
      // データ削除が成功した場合に親コンポーネントの onDelete を呼び出す
      await deleteDictionaryData(id, () => {
        onDelete(id);// 親コンポーネントから削除イベントを通知
      });
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
        onDelete={() => handleDelete(item.Number)}
        onEdit={handleEdit}
        />
    );
};

export default EditDictionaryItem;
