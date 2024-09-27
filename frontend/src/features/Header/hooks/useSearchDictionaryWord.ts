import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import endpoint from '../../../endpoint';

const useSearchDictionaryWord = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // 検索入力が変更された際に検索クエリを更新
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

  // 検索フォームが送信された際にAPIリクエストを行い、結果に基づいてページ遷移を実行
  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // クエリが空白の場合、空の結果でホームページに遷移
    if (!searchQuery.trim()) return navigate('/', { state: { results: [], query: '' } });

    try {
      // 指定されたAPIエンドポイントにGETリクエストを送信し、検索結果を取得
      const response = await fetch(`${endpoint}/dev/dictionary/?word=${searchQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-processing-type1': 'dictionary_word',
          'x-processing-type2': 'get_dictionary_word',
        },
      });
      const data = await response.json();
      // 取得したデータとクエリをナビゲート先に渡す
      navigate('/', { state: { results: data, query: searchQuery } });
    } catch (error) {
      // エラー時にはエラーメッセージを含んだ空の結果をナビゲート先に渡す
      navigate('/', { state: { results: [], query: searchQuery, error: 'Error fetching search results' } });
    }
  };

  const resetSearchQuery = () => {
    setSearchQuery(''); // クエリをリセット
  };

  return { searchQuery, handleSearchChange, handleSearchSubmit, resetSearchQuery };
};

export default useSearchDictionaryWord;
