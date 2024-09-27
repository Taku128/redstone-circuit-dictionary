import React, { useState, useRef, useEffect, useCallback } from 'react';
import './EditAccordionPanel.css';

interface AccordionPanelProps {
  ID: number; 
  Word: string;
  Description: string;
  Categories: string[];
  Videos: string[];
  CreatedAt: string;
  Poster: string;
  onDelete: (id: number, poster: string) => void; 
  onEdit: (id: number, poster: string, updatedData: { word: string; categories: string[]; videos: string[]; description: string; }) => void;
  ResponseMessage: string;
}

const EditAccordionPanel: React.FC<AccordionPanelProps> = ({ ID, Word, Categories, Videos, Description,CreatedAt,Poster, onDelete, onEdit, ResponseMessage}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    word: Word,
    description: Description,
  });
  const [editCategories, setEditCategories] = useState<string[]>(Categories);
  const [editVideos, setEditVideos] = useState<string[]>(Videos);
  const [responseMessage, setResponseMessage] = useState<string>(ResponseMessage);

  // 時間を「2022-06-01」形式に変換
  const formatDateString = (dateString: string): { date: string; } => {
    try {
      // 正規表現で日付と時間部分を抽出
      const regex = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\.\d+ \+\d{4} JST$/;
      const match = dateString.match(regex);
      if (!match) {
        // 正規表現にマッチしない場合は元の文字列をそのまま返す
        return {
          date: dateString
        };
      }
      const [_, datePart, timePart] = match;
      // フォーマットを指定された形式に整形
      const formattedDate = `${datePart} ${timePart.substring(0, 5)}`;
  
      return {
        date: formattedDate,
      };
    } catch (error) {
      console.error('Error formatting date string:', error);
      // エラー発生時も元の文字列をそのまま返す
      return {
        date: dateString
      };
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedData = {
      word: formData.word,
      categories: editCategories,
      videos: editVideos,
      description: formData.description,
    };
    await onEdit(ID,Poster,updatedData);
    setResponseMessage(ResponseMessage)
    adjustContentHeight();
  };

  const togglePanel = () => {
    if (!isHovering) {
      setIsOpen(!isOpen);
      if (!isOpen) setResponseMessage(''); // パネルを閉じたときにメッセージを消去
    }
  };

  const handleEdit = () => {
    adjustTextareaHeight();
    setIsEditing(true);
    setIsOpen(true); // Ensure the panel opens when editing starts
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target instanceof HTMLTextAreaElement) {
      e.target.style.height = 'auto'; 
      e.target.style.height = `${e.target.scrollHeight}px`; 
    }
    handleChange(e);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const updatedCategories = [...editCategories];
    updatedCategories[idx] = e.target.value;
    setEditCategories(updatedCategories);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const updatedVideos = [...editVideos];
    updatedVideos[idx] = e.target.value;
    setEditVideos(updatedVideos);
  };

  const addCategoryInput = () => {
    setEditCategories([...editCategories, '']);
  };

  const addVideoInput = () => {
    setEditVideos([...editVideos, '']);
  };

  const handleCancel = () => {
    setFormData({
      ...formData,
      word:Word,
      description:Description,
    });
    setEditCategories(Categories);
    setEditVideos(Videos);
    setIsOpen(false);
    contentRef.current?.addEventListener('transitionend', () => {
      setIsEditing(false); // モーダルが閉じた後に編集モードを解除
    }, { once: true });
    setResponseMessage('');
  };

  const adjustTextareaHeight = (textarea?: HTMLTextAreaElement) => {
    const element = textarea || document.querySelector('textarea');
    if (element) {
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    }
  };

  const adjustContentHeight = () => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight}px` : "0px";
    }
  };

  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight(document.querySelector('textarea') as HTMLTextAreaElement);
    }
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight}px` : "0px";
    }
  }, [isOpen, isEditing, editCategories, editVideos,formData, responseMessage]);

  return (
    <div className="edit-accordion-panel">
      <div className={`edit-accordion-header ${isHovering ? 'no-hover' : ''}`} onClick={togglePanel} role="button" aria-expanded={isOpen ? "true" : "false"}>
        <div className="edit-accordion-header-text">
          <h2>{Word}</h2>
          <div className="edit-accordion-category">
            {Categories.map((category, index) => (
              <span key={index} className='edit-accordion-category-je'>{category}</span>
            ))}
          </div>
        </div>
        <div className='edit-accordion-button'>
          <button className={`edit-accordion-toggle ${isOpen ? 'open' : ''}`} aria-label={isOpen ? 'Close panel' : 'Open panel'}>
            {isOpen ? '-' : '+'}
          </button>
          <div className="edit-accordion-actions" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <button className="edit-accordion-edit" onClick={() => handleEdit()}>編集</button>
            <button className="edit-accordion-delete" onClick={() => onDelete(ID,Poster)}>削除</button>
          </div>
        </div>
      </div>

      <div ref={contentRef} className={`edit-accordion-content ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        {isEditing ? (
          <div className={'edit-dictionary'}>
            <h1>赤石回路用語の編集</h1>
            <form className={'edit-dictionary-form'} onSubmit={handleSave}>
              <p className='p'>用語</p>
              <input className={'edit-dictionary-input'} type="text" name="word" value={formData.word} onChange={handleChange} placeholder="単語を入力" />
              <p className='p'>説明</p>
              <textarea className={'edit-dictionary-input-description'} name="description" value={formData.description} onChange={handleDescriptionChange} placeholder="説明を入力" />
              <p className='p'>カテゴリー</p>
              {editCategories.map((category, idx) => (
                <input key={idx} type="text" value={category} onChange={(e) => handleCategoryChange(e, idx)} placeholder="カテゴリを入力" />
              ))}
              <button type="button" onClick={addCategoryInput}>カテゴリーの追加</button>
              <p className='p'>YouTube URL</p>
              {editVideos.map((video, idx) => (
                <input key={idx} type="text" value={video} onChange={(e) => handleVideoChange(e, idx)} placeholder="YoutubeのURLを入力" />
              ))}
              <button type="button" onClick={addVideoInput}>URLの追加</button>
              <div className={'saveOrReset'}>
                <button className={'save-dictionary-button'} type="submit">保存</button>
                <button type="button" onClick={handleCancel}>キャンセル</button>
              </div>
            </form>
            {responseMessage && <div className='response-message'>{responseMessage}</div>}
          </div>
        ) : (
          <>
            <p>{Description}</p>
            <div className='edit-accordion-videos'>
              { Videos.map((video, index) => (
              <div key={index} className="edit-accordion-video">
                {video && (
                  <iframe className="edit-accordion-image" src={video} allow="fullscreen" title={`${Word}`} />
                )}
              </div>
              ))}
            </div>
            <p className='edit-accordion-p'>更新日時: {formatDateString(CreatedAt).date}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default EditAccordionPanel;
