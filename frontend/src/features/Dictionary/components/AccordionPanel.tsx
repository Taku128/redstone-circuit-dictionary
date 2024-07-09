import React, { useState, useRef, useEffect } from 'react';
import '../../../css/AccordionPanel.css';

interface AccordionPanelProps {
  title: string;
  categories: string[]; // Ensure categories is an array of strings
  imageUrls: string[]; // Ensure imageUrls is an array of strings
  description: string;
}

const AccordionPanel: React.FC<AccordionPanelProps> = ({ title, categories, imageUrls, description }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
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
    <div className="accordion-panel">
      <div className="accordion-header" onClick={togglePanel} role="button" aria-expanded={isOpen ? "true" : "false"}>
        <div className="accordion-header-text">
          <h2>{title}</h2>
          <div className="accordion-category">
            {categories.map((category: string, index: number) => (
              <span key={index} className='category-je'>{category}</span>
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
          {imageUrls.map((video: string, index: number) => (
            <div key={index} className="accordion-video">
              {video && (
                <iframe className="accordion-image" src={video} allow="fullscreen" title={`${title}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccordionPanel;
