import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { DictionaryItemProps } from '../components/DictionaryItem';

const useDictionaryData = () => {
  const location = useLocation(); 
  const [dictionary, setDictionary] = useState<DictionaryItemProps[]>([]);
  const action = "get_dictionary_word";
  const actionType = "dictionary_word";

  useEffect(() => {
    const fetchData = async () => {
        if (location.state && location.state.results) {
            const searchResults = location.state.results as DictionaryItemProps[];
            setDictionary(searchResults);
        } else {
            try {
                const response = await axios.get<DictionaryItemProps[]>(`https://c3gfeuoxd5.execute-api.ap-northeast-1.amazonaws.com/dev/dictionary/?action=${action}&action_type=${actionType}`);
                const sortedData = response.data.sort((a, b) => a.word.localeCompare(b.word));
                setDictionary(sortedData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
    };

    fetchData();
  }, [location.state]);

  return dictionary;
};

export default useDictionaryData;
