import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const action = "get_dictionary_word";
  const actionType = "dictionary_word";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      navigate('/', { state: { results: [], query: '' } });
      return;
    }

    try {
      const response = await fetch(`https://u4dokqntp1.execute-api.ap-northeast-1.amazonaws.com/dev/dictionary/?word=${searchQuery}&action=${action}&action_type=${actionType}`);
      const data = await response.json();
      console.log('Search results:', data);
      navigate('/', { state: { results: data, query: searchQuery } });
    } catch (error) {
      console.error('Error fetching search results:', error);
      navigate('/', { state: { results: [], query: searchQuery, error: 'Error fetching search results' } });
    }
  };

  return {
    searchQuery,
    handleSearchChange,
    handleSearchSubmit,
  };
};

export default useSearch;
