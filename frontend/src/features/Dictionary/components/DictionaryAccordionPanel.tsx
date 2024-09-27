import React, { useState, useRef, useEffect } from 'react';
import './DictionaryAccordionPanel.css';

interface AccordionPanelProps {
  word: string; 
  categories: string[];
  videos: string[]; 
  description: string;
}

const AccordionPanel: React.FC<AccordionPanelProps> = ({ word, categories, videos, description }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // アコーディオンパネルのトグル機能
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // パネルの開閉に応じて最大高さを調整
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
    <div className="accordion-panel">
      <div className="accordion-header" onClick={togglePanel} role="button" aria-expanded={isOpen ? "true" : "false"}>
        <div className="accordion-header-text">
          <h2>{word}</h2> 
          <div className="accordion-category">
            {categories.map((category: string, index: number) => (
              <span key={index} className='accordion-category-je'>{category}</span>
            ))}
          </div>
        </div>
        <button className={`accordion-toggle ${isOpen ? 'open' : ''}`} aria-label={isOpen ? 'Close panel' : 'Open panel'}>
          {isOpen ? '-' : '+'}
        </button>
      </div>
      <div ref={contentRef} className={`accordion-content ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <p className='accordion-p'>{description}</p> 
        <div className='accordion-videos'>
          {videos.map((video: string, index: number) => (
            <div key={index} className="accordion-video">
              {video && (
                <iframe className="accordion-image" src={video} allow="fullscreen" title={`${word}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccordionPanel;

