// pages/CreateDictionary.tsx

import React, { useState } from 'react';
import { CognitoUserPool,CognitoUserSession } from 'amazon-cognito-identity-js';
import awsConfiguration from '../../../awsConfiguration';
import SignOut from '../../Auth/pages/SignOut/SignOutPage';
import UseFetchAuthSession from '../hooks/useFetchAuthSession';
import SignIn from '../../Auth/pages/SignIn/SignInPage';
import './CreateDictionaryPage.css';
import EditDictionaryPage from './EditDictionaryPage';
import endpoint from '../../../endpoint';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

const CreateDictionary = () => {
  const [formData, setFormData] = useState({
    number: 0,
    category: '',
    description: '',
    video: '',
    word: '',
  });

  const [videos, setVideos] = useState<string[]>(['']);
  const [categories, setCategories] = useState<string[]>(['']);
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (e.target instanceof HTMLTextAreaElement) {
      e.target.style.height = 'auto'; 
      e.target.style.height = `${e.target.scrollHeight}px`; 
    }
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

    var username: string = '';
    var cognitoSession: string = '';
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      try {
        const session = await new Promise<CognitoUserSession>((resolve, reject) => {
          cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
            if (err) {
              reject(err);
            } else if (session) {
              resolve(session);
            } else {
              reject(new Error('Failed Get Session'));
            }
          });
        });

        if (session.isValid()) {
          cognitoSession = session.getAccessToken().getJwtToken();
          username = cognitoUser.getUsername();
        }
        else {
          console.log('Session Is Not Valid');
          return;
        }
      } catch (error) {
        console.error('Error getting user session', error);
        setResponseMessage('Failed Get User');
        return;
      }
    } 
    if (!username){
      console.log('No cognito user found');
      setResponseMessage('No Cognito user found');
      return
    }

    const updatedFormData = {
      ...formData,
      category: JSON.stringify(categories.filter(category => category.trim() !== '')),
      video: JSON.stringify(videos.filter(video => video.trim() !== '')),
      poster: username,
    };

    const requestBody = {
      action_user: username,
      cognito_session: cognitoSession,
      dictionary_word: updatedFormData,
    };
    try {
      const token = await UseFetchAuthSession();
      const response = await fetch(endpoint + '/dev/dictionary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-processing-type1': 'dictionary_word',
          'x-processing-type2': 'create_dictionary_word',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error saving data', errorText);
        throw new Error(`Error saving data: ${errorText}`);
      }
      resetForm();
      console.log('Data saved successfully');
      setResponseMessage('Data saved successfully');
    } catch (error) {
      console.error('Failed to fetch', error);
      setResponseMessage('Error: ' + error);
    }
  };
  

  const resetForm = () => {
    setFormData({
      number: 0,
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
          <textarea
            name="description"
            placeholder="Description"
            className="create-dictionary-input-description"
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
            <button type="submit" className='save-dictionary-button'>Save</button>
            <button type="button" onClick={resetForm} className='reset-dictionary-button'>Reset</button>
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
          <EditDictionaryPage/>
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
