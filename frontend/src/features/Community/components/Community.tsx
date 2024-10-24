import React from 'react';
import useCommunity from '../hooks/useCommunity';
import CommunityItem from './CommunityItem';
import './Community.css';

const Community: React.FC = () => {
  // カスタムフックを使って辞書データを取得
  const community = useCommunity();

  return (
    <div className="Community">
      <div className="community-list">
        {community && Object.values(community).map((item) => (
            <React.Fragment key={item.id}>
                <CommunityItem item={item} />
            </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Community;
