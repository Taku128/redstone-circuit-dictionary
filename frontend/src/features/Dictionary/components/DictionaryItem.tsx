import React from 'react';
import AccordionPanel from './DictionaryAccordionPanel';

export interface DictionaryItemProps {
  id: number;
  word: string;
  description: string;
  category_json: string; 
  video_json: string; 
  poster: string;
  created_at: string;
}

interface DictionaryItemComponentProps {
  item: DictionaryItemProps;
}

const DictionaryItem: React.FC<DictionaryItemComponentProps> = ({ item }) => {
  // JSON形式のカテゴリーとビデオURLを解析
  const parsedCategories: string[] = JSON.parse(item.category_json);
  const parsedVideoUrls: string[] = JSON.parse(item.video_json);
  
  return (
    <AccordionPanel
      word={item.word} 
      categories={parsedCategories}
      videos={parsedVideoUrls}
      description={item.description}
    />
  );
};

export default DictionaryItem;
