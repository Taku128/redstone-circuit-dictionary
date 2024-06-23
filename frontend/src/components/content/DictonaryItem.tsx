import React from 'react';
import PropTypes from 'prop-types';
import AccordionPanel from './AccordionPanel';
import '../css/DictionaryItem.css';

export interface DictionaryItemProps {
    word: string;
    description: string;
    category: string;
    video: string;
}

interface DictionaryItemComponentProps {
    item: DictionaryItemProps;
}

const DictionaryItem :React.FC<DictionaryItemComponentProps> = ({ item }) => {
  return (
    <AccordionPanel
        title={item.word}
        category={item.category}
        imageUrl={item.video}
        description={item.description}
    />
  );
};

DictionaryItem.propTypes = {
  item: PropTypes.shape({
    word: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    video: PropTypes.string.isRequired
  }).isRequired
};

export default DictionaryItem;
