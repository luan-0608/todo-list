import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTaskStore } from '../stores/taskStore';
import { createRipple } from '../utils/rippleEffect';
import './AiSettingsModal.css';

interface AiSettingsModalProps {
  // onClose không còn cần thiết vì chúng ta sẽ dùng store
}

const AiSettingsModal: React.FC<AiSettingsModalProps> = () => {
  const { aiConfig, setAiConfig, toggleAiSettingsModal } = useTaskStore();
  const [url, setUrl] = useState(aiConfig.url);
  const [apiKey, setApiKey] = useState(aiConfig.apiKey);
  const [model, setModel] = useState(aiConfig.model || 'gpt-4o'); // Thêm state cho model

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    setAiConfig({ url, apiKey, model }); // Lưu cả model
    toggleAiSettingsModal();
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    toggleAiSettingsModal();
  }

  return createPortal(
    <div className="modal-overlay" onClick={toggleAiSettingsModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cấu hình AI</h2>
        <div className="form-group">
          <label htmlFor="ai-url">URL Endpoint</label>
          <input
            id="ai-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="VD: https://api.openai.com/v1/chat/completions"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ai-api-key">API Key</label>
          <input
            id="ai-api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Nhập API Key của bạn"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ai-model">Tên Model</label>
          <input
            id="ai-model"
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="VD: gpt-4o, gpt-3.5-turbo"
          />
        </div>
        <div className="modal-actions">
          <button onClick={handleClose} className="button-secondary ripple-btn">
            Hủy
          </button>
          <button onClick={handleSave} className="button-primary ripple-btn">
            Lưu
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AiSettingsModal;