import React from 'react';
import CommunityAccordionPanel from './CommunityAccordionPanel';

export interface CommunityItemProps {
  id: number;
  edition: string;
  title: string;
  content: string; 
  image_name: string; 
  latest_version: string;
  oldest_version: string;
}

interface CommunityItemComponentProps {
  item: CommunityItemProps;
}

const CommunityItem: React.FC<CommunityItemComponentProps> = ({ item }) => {
  return (
    <CommunityAccordionPanel 
        id={item.id}
        edition={item.edition}
        title={item.title}
        content={item.content}
        image_name={item.image_name}
        latest_version={item.latest_version}
        oldest_version={item.oldest_version}
    />
  );
};

export default CommunityItem;
