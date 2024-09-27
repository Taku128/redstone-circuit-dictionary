import React from 'react'; 
import Dictionary from '../../Dictionary/components/Dictionary';
import './DictionaryPage.css'; 

const DictionaryPage: React.FC = () => {
    return (
        <div className='dictionary-home'>
            <div className="dictionary-title-text-center"> 
                <h1 className="font-ubuntu-medium"> 
                    Redstone Circuit Dictionary
                </h1>
                <p>
                    <span>ここはMinecraftのレッドストーン回路用語を</span>
                    <span>集めた場所</span><br />
                    <span>回路勢なら知っておきたい単語が</span>
                    <span>見つかるかも...?</span>
                </p>
            </div>
            <Dictionary /> 
        </div>
    );
};

export default DictionaryPage; 
