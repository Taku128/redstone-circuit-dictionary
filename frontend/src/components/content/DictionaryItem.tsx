import React from 'react';
import PropTypes from 'prop-types';
import AccordionPanel from './AccordionPanel';
import '../css/DictionaryItem.css';

export interface DictionaryItemProps {
  Number: number;
  word: string;
  description: string;
  category: string; // String representation of an array
  video: string; // String representation of an array
}

interface DictionaryItemComponentProps {
  item: DictionaryItemProps;
}

const DictionaryItem: React.FC<DictionaryItemComponentProps> = ({ item }) => {
  console.log(item)
  return (
    <AccordionPanel
      title={item.word}
      categories={item.category || '[]'} // Provide default value if undefined
      imageUrls={item.video || '[]'} // Provide default value if undefined
      description={item.description}
    />
  );
};

DictionaryItem.propTypes = {
  item: PropTypes.shape({
    Number: PropTypes.number.isRequired,
    word: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    video: PropTypes.string.isRequired,
  }).isRequired,
};

export default DictionaryItem;
