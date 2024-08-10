// pages/CreateDictionary.tsx

import React, { useState } from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import awsConfiguration from '../../../awsConfiguration';
import SignOut from '../../Auth/pages/SignOut/SignOutPage';
import UseFetchAuthSession from '../hooks/useFetchAuthSession';
import SignIn from '../../Auth/pages/SignIn/SignInPage';
import './CreatDictionaryPage.css';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

const CreateDictionary = () => {
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
      const token = await UseFetchAuthSession();
      const response = await fetch('', {
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

  const renderCreateDictionary = () => {
    return (
      <div className='create-dictionary'>
        <h1>Add Dictionary</h1>
        <form onSubmit={handleSubmit} className='create-dictionary-form'>
          <p className='p'>Word</p>
          <input
            type="text"
            name="word"
            placeholder="Word"
            className="create-dictionary-input"
            value={formData.word}
            onChange={handleChange}
          />
          <p className='p'>Category</p>
          {categories.map((category, index) => (
            <div key={index} className='category-input-group'>
              <input
                type="text"
                placeholder={`Category ${index + 1}`}
                className="create-dictionary-input"
                value={category}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addCategoryInput} className='create-dictionary-button'>Add Category</button>
          <p className='p'>Description</p>
          <input
            type="text"
            name="description"
            placeholder="Description"
            className="create-dictionary-input"
            value={formData.description}
            onChange={handleChange}
          />
          <p className='p'>YouTube URL</p>
          {videos.map((video, index) => (
            <div key={index} className='video-input-group'>
              <input
                type="text"
                placeholder={`Video ${index + 1}`}
                className="create-dictionary-input"
                value={video}
                onChange={(e) => handleVideoChange(index, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addVideoInput} className='create-dictionary-button'>Add Video</button>
          <div className='saveOrReset'>
            <button type="submit" className='create-dictionary-button'>Save</button>
            <button type="button" onClick={resetForm} className='create-dictionary-button'>Reset</button>
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
          {renderCreateDictionary()}
          <SignOut />
        </div>
      );
    } else {
      return (<SignIn/>)
    }
  };

  return (
    <div>
      {authentication()}
    </div>
  );
};

export default CreateDictionary;
