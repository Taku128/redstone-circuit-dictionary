import React, { useState, useRef, useEffect } from 'react';
import './CommunityAccordionPanel.css';

interface CommunityAccordionPanelProps {
    id: number;
    edition: string;
    title: string;
    content: string; 
    image_name: string; 
    latest_version: string;
    oldest_version: string;
}

const CommunityAccordionPanel: React.FC<CommunityAccordionPanelProps> = ({ id,edition,title,content,image_name,latest_version,oldest_version }) => {

  // アコーディオンの開閉状態を管理するための state を定義
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // パネルがクリックされたときに開閉状態を切り替える関数
  const toggleAccordion = () => {
      setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        contentRef.current.style.maxHeight = contentRef.current.scrollHeight + "px";
      } else {
        contentRef.current.style.maxHeight = "0px";
      }
    }
  }, [isOpen]);

  return (
      <div className="community-accordion-panel">
          <div className="accordion-header" onClick={toggleAccordion}>
              <h2>{title}</h2>
              {/* 開閉アイコン */}
              <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>
                  {isOpen ? '-' : '+'}
              </span>
          </div>
          {/* パネルの内容をアコーディオン形式で表示 */}
          {isOpen && (
              <div ref={contentRef} className="accordion-content">
                  <p>{content}</p>
                  <p><strong>Version:</strong> {oldest_version} ~ {latest_version}</p>
              </div>
          )}
      </div>
  );
};

export default CommunityAccordionPanel;

