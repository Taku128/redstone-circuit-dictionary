import React, { useState, useEffect } from 'react';
import useDictionaryData from '../hooks/useDictionaryData';
import DictionaryItem, { DictionaryItemProps } from './DictionaryItem';
import Separator from './Separator';
import './Dictionary.css';

const Dictionary: React.FC = () => {
  // カスタムフックを使って辞書データを取得
  const dictionary = useDictionaryData();
  
  // 辞書データをグループ化するための状態を定義
  const [groupedDictionary, setGroupedDictionary] = useState<{ [key: string]: DictionaryItemProps[] }>({});

  useEffect(() => {
    // 辞書が空の場合は処理を終了
    if (dictionary.length === 0) return;

    // 辞書データをアルファベットの最初の文字でグループ化
    const groupedData = dictionary.reduce((acc, item) => {
      // item.wordが存在し、文字列であることをチェック
      if (item.word && typeof item.word === 'string') {
        const firstLetter = item.word[0].toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(item); // グループにアイテムを追加
      } else {
        console.warn(`Invalid item encountered:`, item); // 無効なアイテムがあった場合の警告
      }
      return acc;
    }, {} as { [key: string]: DictionaryItemProps[] });

    // グループ化したデータを状態に設定
    setGroupedDictionary(groupedData);
  }, [dictionary]);

  return (
    <div className="Dictionary">
      <div className="dictionary-list">
        {Object.keys(groupedDictionary).map((letter) => (
          <React.Fragment key={letter}>
            <h2 className='dictionary-list-h2'>{letter}</h2>
            {groupedDictionary[letter].map((item, idx) => (
              <div key={item.word + idx}>
                {idx > 0 && <Separator />} {/* 2つ目以降のアイテムの前にセパレーターを追加 */}
                <DictionaryItem item={item} />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Dictionary;
