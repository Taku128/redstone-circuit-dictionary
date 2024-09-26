import React, { useState, useRef, useEffect } from 'react';
import { CognitoUserPool,CognitoUserSession } from 'amazon-cognito-identity-js';
import useFetchAuthSession from '../hooks/useFetchAuthSession';
import awsConfiguration from '../../../awsConfiguration';
import endpoint from '../../../endpoint';
import './EditAccordionPanel.css';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

interface AccordionPanelProps {
  ID: number; 
  Word: string;
  Description: string;
  Categories: string[];
  Videos: string[];
  CreatedAt: string;
  Poster: string;
  onDelete: (id: number, poster: string) => void; 
  onEdit: (id: number, updatedData: { word: string; categories: string[]; videos: string[]; description: string; created_at: string }) => void;
}

const EditAccordionPanel: React.FC<AccordionPanelProps> = ({ ID, Word, Categories, Videos, Description,CreatedAt,Poster, onDelete, onEdit }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [session, setSession] = useState<CognitoUserSession | null>(null);

  const [editTitle, setEditTitle] = useState<string>(Word);
  const [editCategories, setEditCategories] = useState<string[]>(Categories);
  const [editImageUrls, setEditImageUrls] = useState<string[]>(Videos);
  const [editDescription, setEditDescription] = useState<string>(Description);
  const [editCreatedAt, setEditCreatedAt] = useState<string>(CreatedAt);
  const [responseMessage, setResponseMessage] = useState<string>('');


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

  const handleCategoryChange = (index: number, value: string) => {
    const updatedCategories = [...editCategories];
    updatedCategories[index] = value;
    setEditCategories(updatedCategories);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target instanceof HTMLTextAreaElement) {
      e.target.style.height = 'auto'; 
      e.target.style.height = `${e.target.scrollHeight}px`; 
    }
    setEditDescription(e.target.value);
  };

  const addCategoryInput = () => {
    setEditCategories([...editCategories, '']);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const updatedUrls = [...editImageUrls];
    updatedUrls[index] = value;
    setEditImageUrls(updatedUrls);
  };

  const addImageUrlInput = () => {
    setEditImageUrls([...editImageUrls, '']);
  };

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

  const getJSTISOString = () => {
    const date = new Date();
  
    // 日本時間に調整
    const jstOffset = 0 * 60; // JSTはUTC+9時間
    const utcDate = new Date(date.getTime() + jstOffset * 60000);

    // 年、月、日、時、分、秒、ナノ秒を取得
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');
    const seconds = String(utcDate.getSeconds()).padStart(2, '0');
    
    // ナノ秒は固定値を使用（JavaScriptのDateオブジェクトにはミリ秒までしかサポートされていない）
    const nanoseconds = '000000000'; // 固定値として使用

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${nanoseconds} +0900 JST`;
  };

  const convertURLsToString = (urls: string[]): string => {
    try {
      // 配列をJSON形式の文字列に変換
      const urlsString = JSON.stringify(urls);
      return urlsString;
    } catch (err) {
      return '[]';
    }
  };

  const isYoutubeURL = (url: URL): boolean => {
    return url.hostname === 'www.youtube.com' || url.hostname === 'youtu.be';
  };
  
  const isContainedEmbed = (url: URL): boolean => {
    return url.pathname.includes('embed');
  };

  useEffect(() => {
    const FetchSession = async () => {
      const fetchedSession = await useFetchAuthSession(userPool);
      setSession(fetchedSession);
    };
    
    FetchSession();
  }, []);
  
  const validateAndConvertURLs = (urls: string[]): string[] => {
    const result: string[] = [];
  
    for (const v of urls) {
      try {
        const url = new URL(v);
  
        if (!isYoutubeURL(url)) {
          return [];
        }
  
        if (isContainedEmbed(url)) {
          result.push(v);
          continue;
        }
  
        // 埋め込み式のURLに変換
        let videoID = '';
        if (url.hostname === 'www.youtube.com') {
          videoID = url.searchParams.get('v') || '';
          if (!videoID) {
            return [];
          }
        } else if (url.hostname === 'youtu.be') {
          videoID = url.pathname.substring(1);
        }
  
        const embedURL = `https://www.youtube.com/embed/${videoID}`;
        result.push(embedURL);
      } catch (err) {
        return [];
      }
    }
  
    return result;
  };

  const handleSave = async () => {
    const updatedData = {
      word: editTitle,
      categories: editCategories,
      videos: editImageUrls,
      description: editDescription,
      created_at: getJSTISOString() // Update created_at with current timestamp
    };
    setEditCreatedAt(updatedData.created_at);
    try {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        const session = await new Promise<CognitoUserSession>((resolve, reject) => {
          cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
            if (err) {
              reject(err);
            } else if (session) {
              resolve(session);
            } else {
              reject(new Error('Failed Get Session'));
            }
          });
        });

        if (session.isValid()) {
          const cognitoSession = session.getAccessToken().getJwtToken();
          const username = cognitoUser.getUsername();

          const updatedFormData = {
            ...updatedData,
            category_json: JSON.stringify(editCategories.filter(category => category.trim() !== '')),
            video_json: JSON.stringify(editImageUrls.filter(video => video.trim() !== '')),
            poster: username,
          };

          const requestBody = {
            action_user: username,
            cognito_session: cognitoSession,
            dictionary_word: updatedFormData,
          };

          const response = await fetch(endpoint + `/dev/dictionary/${ID}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session}`,
              'x-processing-type1': 'dictionary_word',
              'x-processing-type2': 'update_dictionary_word',
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error saving data', errorText);
            throw new Error(`Error saving data: ${errorText}`);
          }
          const videos = validateAndConvertURLs(updatedData.videos);
          updatedFormData.video_json = convertURLsToString(videos);
          console.log(updatedFormData)
          onEdit(ID, updatedFormData);
          setResponseMessage('Data saved successfully');
        } else {
          console.log('Session Is Not Valid');
          setResponseMessage('Session is not valid');
        }
      } else {
        console.log('No cognito user found');
        setResponseMessage('No Cognito user found');
      }
    } catch (error) {
      console.error('Failed to fetch', error);
      setResponseMessage('Error: ' + error);
    }
    adjustContentHeight();
  };

  const handleCancel = () => {
    // Reset the values to their original state and exit edit mode
    setEditTitle(Word);
    setEditCategories(Categories);
    setEditImageUrls(Videos);
    setEditDescription(Description);
    setEditCreatedAt(CreatedAt); 
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
  }, [isOpen, isEditing, editCategories, editImageUrls, editDescription, responseMessage]);

  return (
    <div className="accordion-panel">
      <div 
        className={`accordion-header ${isHovering ? 'no-hover' : ''}`} 
        onClick={togglePanel} 
        role="button" 
        aria-expanded={isOpen ? "true" : "false"}
      >
        <div className="accordion-header-text">
          <h2>{Word}</h2>
          <div className="accordion-category">
            {Categories.map((category, index) => (
              <span key={index} className='category-je'>{category}</span>
            ))}
          </div>
        </div>
        <div className='accordion-button'>
          <button className={`accordion-toggle ${isOpen ? 'open' : ''}`} aria-label={isOpen ? 'Close panel' : 'Open panel'}>
            {isOpen ? '-' : '+'}
          </button>
          <div 
            className="accordion-actions" 
            onMouseEnter={() => setIsHovering(true)} 
            onMouseLeave={() => setIsHovering(false)}
          >
            <button className="accordion-edit" onClick={() => handleEdit()}>Edit</button>
            <button className="accordion-delete" onClick={() => onDelete(ID,Poster)}>Delete</button>
          </div>
        </div>
      </div>

      <div ref={contentRef} className={`accordion-content ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        {isEditing ? (
          <div className="edit-form">
            <h1>Word</h1>
            <input 
              type="text" 
              value={editTitle} 
              onChange={(e) => setEditTitle(e.target.value)} 
              placeholder="Edit title" 
            />
            <h1>Category</h1>
            {editCategories.length ? (
              editCategories.map((category, index) => (
                <div key={index} className='category-input-group'>
                  <input
                    type="text"
                    placeholder={`Category ${index + 1}`}
                    value={category}
                    onChange={(e) => handleCategoryChange(index, e.target.value)}
                  />
                </div>
              ))
            ):(
              <p>なし</p>
            )}
            <button type="button" onClick={addCategoryInput} className='add-button'>Add Category</button>
            <h1>Description</h1>
            <textarea
              value={editDescription}
              onChange={handleDescriptionChange}
              placeholder="Edit description"
            />
            <h1>YouTube URL</h1>
            {editImageUrls.length ? (
            editImageUrls.map((url, index) => (
              <div key={index} className='image-url-input-group'>
                <input
                  type="text"
                  placeholder={`Image URL ${index + 1}`}
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                />
              </div>
            ))
          ):(
            <p>なし</p>
          )}
            <button type="button" onClick={addImageUrlInput} className='add-button'>Add Video</button>

            <div className='form-actions'>
              <button className='save-button' onClick={handleSave}>Save</button>
              <button className='cancel-button' onClick={handleCancel}>Cancel</button>
            </div>
            {responseMessage && <div className='response-message'>{responseMessage}</div>}
          </div>
        ) : (
          <>
            <p>{Description}</p>
            <div className='accordion-videos'>
             { Videos.map((video, index) => (
              <div key={index} className="accordion-video">
                {video && (
                  <iframe className="accordion-image" src={video} allow="fullscreen" title={`${Word}`} />
                )}
              </div>
              ))}
            </div>
            <p className='accordion-p'>更新日時: {formatDateString(editCreatedAt).date}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default EditAccordionPanel;
