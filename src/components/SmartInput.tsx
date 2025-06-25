import React, { useState, useRef, useLayoutEffect } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { createRipple } from '../utils/rippleEffect';
import { getSmartTask } from '../utils/api';
import './SmartInput.css';

const SmartInput: React.FC = () => {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    console.log('Bắt đầu phân tích...');
    if (!value.trim() || isLoading) {
      console.log('Bỏ qua: value rỗng hoặc đang tải.');
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log('Cấu hình AI hiện tại:', aiConfig);

    try {
      // Logic mới: Cho phép dùng mock API nếu URL và Key trống
      if (!aiConfig.url && !aiConfig.apiKey) {
        console.log('Sử dụng API giả lập (msw) vì URL và Key trống.');
      } else if (!aiConfig.url || !aiConfig.apiKey || !aiConfig.model) {
        // Yêu cầu cấu hình đầy đủ nếu một trong các trường đã được điền
        throw new Error('Vui lòng cấu hình đầy đủ API URL, Key và Model trong cài đặt AI.');
      }
      
      console.log('Đang gọi getSmartTask với:', { value, ...aiConfig });
      const parsedTask = await getSmartTask(value, aiConfig.apiKey, aiConfig.url, aiConfig.model);
      console.log('Nhận được công việc đã phân tích:', parsedTask);
      
      addTask(parsedTask);
      setValue(''); // Xóa input sau khi thêm thành công
    } catch (err: any) {
      console.error('Lỗi khi phân tích:', err);
      setError(err.message || 'Không thể phân tích công việc.');
    } finally {
      console.log('Kết thúc phân tích.');
      setIsLoading(false);
    }
  };

  return (
    <div className="smart-input-container">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Nhập công việc... (VD: 'Thiết kế lại trang chủ vào ngày mai #design !high')"
        rows={1}
        disabled={isLoading}
      />
      <button onClick={handleAnalyze} className="ai-analyze-btn ripple-btn" disabled={isLoading}>
        {isLoading ? 'Đang phân tích...' : 'Phân tích bằng AI'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SmartInput;