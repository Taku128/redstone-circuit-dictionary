import { useState } from 'react';
import DictionaryForm from '../components/DictionaryForm';
import useDictionarySubmit from '../hooks/useCreatDictionary';

// 入力画面から得たデータ
interface DictionaryWordFormDataProps {
  word: string;
  description: string;
  categories: string[];
  videos: string[];
}

// httpsリクエストとして送るデータ
export interface DictionaryWordFormData {
  word: string;
  description: string;
  category_json: string;
  video_json: string;
}

const CreateDictionaryPage = () => {
  const initialFormData: DictionaryWordFormData = {
    word: '',
    description: '',
    category_json: '',
    video_json: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const { handleSubmit, responseMessage } = useDictionarySubmit(() => setFormData(formData));

  const submitForm = async (data: DictionaryWordFormDataProps) => {
    const updatedFormData: DictionaryWordFormData = {
      word:data.word,
      description:data.description,
      category_json: JSON.stringify(data.categories.filter(category => category.trim() !== '')),
      video_json: JSON.stringify(data.videos.filter(video => video.trim() !== '')),
    };
    await handleSubmit(updatedFormData);
  };

  return (
    <div>
      <DictionaryForm 
        handleSubmit={submitForm} 
        resetForm={() => setFormData(initialFormData)} 
        responseMessage={responseMessage} 
      />
    </div>
  );
};

export default CreateDictionaryPage;
