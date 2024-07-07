import React, { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import '../css/CreatDictonray.css';

import { CognitoUserPool } from 'amazon-cognito-identity-js';
import awsConfiguration from '../../awsConfiguration';
import Login from '../login';
import SignOut from '../auth/SignOut';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

const CreatDictonary = () => {
  const [formData, setFormData] = useState({
    number: '',
    category: '',
    description: '',
    video: '',
    word: '',
  });

  const [videos, setVideos] = useState<string[]>(['']);
  const [categories, setCategories] = useState<string[]>(['']);
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (index: number, value: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = value;
    setCategories(updatedCategories);
  };

  const addCategoryInput = () => {
    setCategories([...categories, '']);
  };

  const handleVideoChange = (index: number, value: string) => {
    const updatedVideos = [...videos];
    updatedVideos[index] = value;
    setVideos(updatedVideos);
  };

  const addVideoInput = () => {
    setVideos([...videos, '']);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      category: JSON.stringify(categories.filter(category => category.trim() !== '')),
      video: JSON.stringify(videos.filter(video => video.trim() !== '')),
    };
    try {
      const session = await fetchAuthSession();
      const token = session.tokens;
      const response = await fetch('https://u4dokqntp1.execute-api.ap-northeast-1.amazonaws.com/dev/dictionary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error saving data', errorText);
        throw new Error(`Error saving data: ${errorText}`);
      }
      console.log('Data saved successfully');
      setResponseMessage('Data saved successfully');
    } catch (error) {
      console.error('Failed to fetch', error);
      setResponseMessage('Error: ' + error);
    }
  };

  const resetForm = () => {
    setFormData({
      number: '',
      category: '',
      description: '',
      video: '',
      word: '',
    });
    setCategories(['']);
    setVideos(['']);
  };

  const renderCreatDictonary = () => {
    return (
      <div className='creat-dictonary'>
        <h1>Add Dictionary</h1>
        <form onSubmit={handleSubmit} className='creat-dictonary-form'>
          <p className='p'>用語</p>
          <input
            type="text"
            name="word"
            placeholder="Word"
            className="creat-dictonary-input"
            value={formData.word}
            onChange={handleChange}
          />
          <p className='p'>カテゴリ</p>
          {categories.map((category, index) => (
            <div key={index} className='category-input-group'>
              <input
                type="text"
                placeholder={`Category ${index + 1}`}
                className="creat-dictonary-input"
                value={category}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addCategoryInput} className='creat-dictonary-button'>Add Category</button>
          <p className='p'>説明</p>
          <input
            type="text"
            name="description"
            placeholder="Description"
            className="creat-dictonary-input"
            value={formData.description}
            onChange={handleChange}
          />
          <p className='p'>YouTube URL</p>
          {videos.map((video, index) => (
            <div key={index} className='video-input-group'>
              <input
                type="text"
                placeholder={`Video ${index + 1}`}
                className="creat-dictonary-input"
                value={video}
                onChange={(e) => handleVideoChange(index, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addVideoInput} className='creat-dictonary-button'>Add Video</button>
          <div className='saveOrReset'>
            <button type="submit" className='creat-dictonary-button'>Save</button>
            <button type="button" onClick={resetForm} className='creat-dictonary-button'>Reset</button>
          </div>
        </form>
        {responseMessage && <div className='response-message'>{responseMessage}</div>}
      </div>
    );
  };

  const authentication = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      return (
        <div className="authorizedMode">
          {renderCreatDictonary()}
          <SignOut />
        </div>
      );
    } else {
      return (
        <div className="unauthorizedMode">
          <Login />
        </div>
      );
    }
  };

  return (
    <div>
      {authentication()}
    </div>
  );
};

export default CreatDictonary;
