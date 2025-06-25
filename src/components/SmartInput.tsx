import React, { useState, useRef, useLayoutEffect } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { createRipple } from '../utils/rippleEffect';
import './SmartInput.css';

// A simple NLP-like function to parse the task string
const parseTaskString = (text: string) => {
  const title = text.split(/#|!/)[0].trim();
  
  const tags = [...text.matchAll(/#(\w+)/g)].map(match => match[1]);
  
  const priorityMatch = text.match(/!(high|medium|low)/);
  const priority = priorityMatch ? priorityMatch[1] as 'high' | 'medium' | 'low' : 'medium';

  // Simple date parsing (not exhaustive)
  const deadline = new Date();
  if (text.includes('ngày mai')) {
    deadline.setDate(deadline.getDate() + 1);
  } else if (text.includes('hôm nay')) {
    // keep today
  }

  return {
    title,
    description: '', // AI can fill this later
    tags,
    priority,
    deadline: deadline.toISOString().split('T')[0],
    progress: 0,
  };
};


const SmartInput: React.FC = () => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addTask, aiConfig } = useTaskStore();

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const handleAnalyze = async (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    if (!value.trim()) return;

    // Here you would call the actual OpenAI-compatible API
    // For now, we'll use the local parser
    console.log('Phân tích với cấu hình:', aiConfig);
    
    const parsedTask = parseTaskString(value);
    addTask(parsedTask);
    
    setValue(''); // Clear input after adding
  };

  return (
    <div className="smart-input-container">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Nhập công việc... (VD: 'Thiết kế lại trang chủ vào ngày mai #design !high')"
        rows={1}
      />
      <button onClick={handleAnalyze} className="ai-analyze-btn ripple-btn">Phân tích bằng AI</button>
    </div>
  );
};

export default SmartInput;