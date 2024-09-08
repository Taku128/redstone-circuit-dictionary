import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { DictionaryItemProps } from '../components/DictionaryItem';
import endpoint from '../../../endpoint';

const useDictionaryData = () => {
  const location = useLocation(); 
  const [dictionary, setDictionary] = useState<DictionaryItemProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        if (location.state && location.state.results) {
            const searchResults = location.state.results as DictionaryItemProps[];
            setDictionary(searchResults);
        } else {
            try {
                const response = await axios.get<DictionaryItemProps[]>(endpoint +`/dev/dictionary/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-processing-type1': 'dictionary_word',
                        'x-processing-type2': 'get_dictionary_word',
                    },
                });
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
