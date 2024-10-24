import React from 'react'; 
import Community from '../components/Community';
import './CommunityPage.css'; 

const CommunityPage: React.FC = () => {
    return (
        <div className='community-home'>
            <div className="community-title-text-center"> 
                <h1 className="font-ubuntu-medium"> 
                    Redstone Community
                </h1>
            </div>
            <Community /> 
        </div>
    );
};

export default CommunityPage; 
