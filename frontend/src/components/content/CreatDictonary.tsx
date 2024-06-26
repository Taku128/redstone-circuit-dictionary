import React, { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import '../css/CreatDictonray.css'

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../awsConfiguration'
import Login from '../login';
import SignOut from '../auth/SignOut';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

const CreatDictonary = () => {
  const [formData, setFormData] = useState({
    number: '',
    category: '',
    description: '',
    video: '',
    word: ''
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const session = await fetchAuthSession();
      const token = session.tokens;
      const response = await fetch('https://u4dokqntp1.execute-api.ap-northeast-1.amazonaws.com/dev/dictionary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error saving data', errorText);
      throw new Error(`Error saving data: ${errorText}`);
    }
    console.log('Data saved successfully');
    setResponseMessage('Data saved successfully');
    }catch(error){
      console.error('Failed to fetch', error);
      setResponseMessage('Error: ' + error);
    }
  };

  const CreatDictonary = () => {
    return (
      <div className='creat-dictonary'>
        <h1>Add Dictonary</h1>
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
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="creat-dictonary-input"
            value={formData.category}
            onChange={handleChange}
          />
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
          <input
            type="text"
            name="video"
            placeholder="Video"
            className="creat-dictonary-input"
            value={formData.video}
            onChange={handleChange}
          />
          <button type="submit" className='creat-dictonary-button'>Save</button>
        </form>
        {responseMessage && <div className='response-message'>{responseMessage}</div>}
      </div>
    );
  };

  const authentication = () => {
    const cognitoUser = userPool.getCurrentUser()
    // サインインユーザーがいればアプリのメイン画面へ、
    // いなければサインアップ、検証、サインイン画面を表示する。
    if (cognitoUser) {
      return (
        <div className="authorizedMode">
          <SignOut/>
          {CreatDictonary()}
        </div>
      )
    } else {
      return (
        <div className="unauthorizedMode">
          <Login/>
        </div>
      )
    }
  }
  return (
    <div>
      {authentication()}
    </div>
  );
};

export default CreatDictonary;
