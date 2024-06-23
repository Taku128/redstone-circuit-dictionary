import React, { useState, useRef, useEffect } from 'react';
import '../css/AccordionPanel.css';

interface AccordionPanelProps {
  title: string;
  category: string;
  imageUrl?: string;
  description: string;
}

const AccordionPanel: React.FC<AccordionPanelProps> = ({ title, category, imageUrl, description }) => {
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
      <div className="accordion-header" onClick={togglePanel}>
        <div className="accordion-header-test">
            <h2>{title}</h2>
            <span className='category-je'>{category}</span>
        </div>
        <button className={`accordion-toggle ${isOpen ? 'open' : ''}`}>
            {isOpen ? '-' : '+'}
        </button>
      </div>
      <div ref={contentRef} className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <p className='accordion-p'>{description}</p>
        {imageUrl && (
        <iframe className="accordion-image" src={imageUrl} allow="fullscreen" title={title}/>
        )}
        
      </div>
    </div>
  );
};

export default AccordionPanel;
