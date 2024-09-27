import DictionaryForm from '../components/CreateDictionaryForm';
import useCreateDictionary from '../hooks/useCreatDictionary';

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
  const { handleSubmit, responseMessage, clearResponseMessage } = useCreateDictionary(() => {});

  const submitForm = async (data: DictionaryWordFormDataProps) => {
    const updatedFormData: DictionaryWordFormData = {
      word:data.word,
      description:data.description,
      category_json: JSON.stringify(data.categories.filter(category => category.trim() !== '')),
      video_json: JSON.stringify(data.videos.filter(video => video.trim() !== '')),
    };
    await handleSubmit(updatedFormData);
  };

  const resetForm = () => {
    clearResponseMessage();
  };

  return (
    <div>
      <DictionaryForm 
        handleSubmit={submitForm} 
        resetForm={resetForm} 
        responseMessage={responseMessage} 
      />
    </div>
  );
};

export default CreateDictionaryPage;
