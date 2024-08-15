import React, { useState, useRef, useEffect } from 'react';
import './EditAccordionPanel.css';

interface AccordionPanelProps {
  id: number; 
  title: string;
  categories: string[];
  imageUrls: string[];
  description: string;
  createdAt: string;
  onDelete: (id: number) => void; 
  onEdit: (id: number) => void;
}

const EditAccordionPanel: React.FC<AccordionPanelProps> = ({ id, title, categories, imageUrls, description,createdAt, onDelete, onEdit }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const togglePanel = () => {
    if (!isHovering) {
      setIsOpen(!isOpen);
    }
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
      <div 
        className={`accordion-header ${isHovering ? 'no-hover' : ''}`} 
        onClick={togglePanel} 
        role="button" 
        aria-expanded={isOpen ? "true" : "false"}
      >
        <div className="accordion-header-text">
          <h2>{title}</h2>
          <div className="accordion-category">
            {categories.map((category, index) => (
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
          <button className="accordion-edit" onClick={() => onEdit(id)}>Edit</button>
          <button className="accordion-delete" onClick={() => onDelete(id)}>Delete</button>
        </div>
        </div>
      </div>
      <div ref={contentRef} className={`accordion-content ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <p className='accordion-p'>{description}</p>
        <div className='accordion-videos'>
          {imageUrls.map((video, index) => (
            <div key={index} className="accordion-video">
              {video && (
                <iframe className="accordion-image" src={video} allow="fullscreen" title={`${title}`} />
              )}
            </div>
          ))}
        </div>
        <p className='accordion-p'>更新日時: {createdAt}</p>
      </div>  
    </div>
  );
};

export default EditAccordionPanel;
