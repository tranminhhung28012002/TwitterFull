import React, { useEffect, useRef, useState } from 'react';
import { inherits } from 'util';
import styles from './AutoResizeTextarea.module.scss';

interface AutoResizeTextareaProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]); // Chạy hàm khi giá trị thay đổi

  return (
    <textarea className={styles.textArea}
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default AutoResizeTextarea;
