import React, { useState } from 'react';
import '../css/CreatDictonray.css'

const CreatDictonary = () => {
  const [formData, setFormData] = useState({
    number: '',
    category: '',
    description: '',
    video: '',
    word: ''
  });

  const [categories, setCategories] = useState<string[]>(['']);
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      category: JSON.stringify(categories.filter(category => category.trim() !== ''))
    };
    try {
      const response = await fetch('https://u4dokqntp1.execute-api.ap-northeast-1.amazonaws.com/dev/dictionary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFormData)
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

export default CreatDictonary;
