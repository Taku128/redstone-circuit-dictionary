import React, { useState, useRef, useEffect } from 'react';
import '../css/AccordionPanel.css';

interface AccordionPanelProps {
  title: string;
  categories: string; // String representation of an array
  imageUrls: string; // String representation of an array
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

  // Parse categories and imageUrls
  const parsedCategories: string[] = JSON.parse(categories);
  const parsedImageUrls: string[] = JSON.parse(imageUrls);
  console.log(imageUrls)
  console.log(parsedImageUrls)

  return (
    <div className="accordion-panel">
      <div className="accordion-header" onClick={togglePanel}>
        <div className="accordion-header-text">
          <h2>{title}</h2>
          <div className="accordion-category">
            {parsedCategories.map((category: string, index: number) => (
              <span key={index} className='category-je'>{category}</span>
            ))}
          </div>
        </div>
        <button className={`accordion-toggle ${isOpen ? 'open' : ''}`}>
          {isOpen ? '-' : '+'}
        </button>
      </div>
      <div ref={contentRef} className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <p className='accordion-p'>{description}</p>
        {parsedImageUrls.map((video: string, index: number) => (
          <div key={index} className="accordion-video">
            {parsedImageUrls[index] && (
              <iframe key={index} className="accordion-image" src={parsedImageUrls[index]} allow="fullscreen" title={`${title}`}/>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccordionPanel;
