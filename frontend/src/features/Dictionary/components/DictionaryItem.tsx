import React from 'react';
import AccordionPanel from './AccordionPanel';
import './DictionaryItem.css';

export interface DictionaryItemProps {
  Number: number;
  word: string;
  description: string;
  category: string; 
  video: string; 
}

interface DictionaryItemComponentProps {
  item: DictionaryItemProps;
}

const DictionaryItem: React.FC<DictionaryItemComponentProps> = ({ item }) => {
    const parsedCategories: string[] = JSON.parse(item.category);
    const parsedImageUrls: string[] = JSON.parse(item.video);
    return (
        <AccordionPanel
        title={item.word}
        categories={parsedCategories}
        imageUrls={parsedImageUrls}
        description={item.description}
        />
    );
};

export default DictionaryItem;
