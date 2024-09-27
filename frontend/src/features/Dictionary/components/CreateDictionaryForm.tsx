import React, { useState } from 'react';
import './CreateDictionaryForm.css'; 

interface DictionaryFormProps {
    handleSubmit: (formData: any) => void;
    resetForm: () => void;
    responseMessage: string;
}

const DictionaryForm: React.FC<DictionaryFormProps> = ({ handleSubmit, resetForm, responseMessage }) => {
  const [formData, setFormData] = useState({
    word: '',
    description: '',
  });
  const [categories, setCategories] = useState<string[]>(['']);
  const [videos, setVideos] = useState<string[]>(['']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // カテゴリやビデオの入力を動的に更新
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const newCategories = [...categories];
    newCategories[idx] = e.target.value;
    setCategories(newCategories);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const newVideos = [...videos];
    newVideos[idx] = e.target.value;
    setVideos(newVideos);
  };

  const resetFormHandler = () => {
    setFormData({
      word: '',
      description: '',
    });
    setCategories(['']);  
    setVideos(['']); 
    resetForm();
  };

  const addCategoryInput = () => setCategories([...categories, '']);
  const addVideoInput = () => setVideos([...videos, '']);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({ ...formData, categories: categories, videos: videos });
  };

  return (
    <div className={'create-dictionary'}>
      <h1>赤石回路用語の追加</h1>
      <form className={'create-dictionary-form'} onSubmit={submitForm}>
        <p className='p'>用語</p>
        <input className={'create-dictionary-input'} type="text" name="word" value={formData.word} onChange={handleChange} placeholder="単語を入力" />
        <p className='p'>説明</p>
        <textarea className={'create-dictionary-input-description'} name="description" value={formData.description} onChange={handleChange} placeholder="説明を入力" />
        <p className='p'>カテゴリー</p>
        {categories.map((category, idx) => (
          <input key={idx} type="text" value={category} onChange={(e) => handleCategoryChange(e, idx)} placeholder="カテゴリを入力" />
        ))}
        <button type="button" onClick={addCategoryInput}>カテゴリーの追加</button>
        <p className='p'>YouTube URL</p>
        {videos.map((video, idx) => (
          <input key={idx} type="text" value={video} onChange={(e) => handleVideoChange(e, idx)} placeholder="YoutubeのURLを入力" />
        ))}
        <button type="button" onClick={addVideoInput}>URLの追加</button>
        <div className={'saveOrReset'}>
          <button className={'save-dictionary-button'} type="submit">保存</button>
          <button type="button" onClick={resetFormHandler}>リセット</button>
        </div>
      </form>
      {responseMessage && <div className='response-message'>{responseMessage}</div>}
    </div>
  );
};

export default DictionaryForm;
