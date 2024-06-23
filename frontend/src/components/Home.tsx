import React from 'react';
import Dictionary from './content/Dictonary';
import './css/Home.css'

const Home: React.FC = () => {
    return (
        <div className='home'>
            <div className="title-text-center">
            <h1 className="font-ubuntu-medium">
                Redstone Circuit Dictonary
            </h1>
            <p>
                <span>ここはMinecraftのレッドストーン回路用語を</span><span>集めた場所</span><br />
                <span>回路勢なら知っておきたい単語が</span><span>見つかるかも...?</span>
            </p>
            </div>
            <Dictionary/>
        </div>
    );
};

export default Home
