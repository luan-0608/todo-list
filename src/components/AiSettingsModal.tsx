import React, { useState } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { createRipple } from '../utils/rippleEffect';
import './AiSettingsModal.css';

interface AiSettingsModalProps {
  onClose: () => void;
}

const AiSettingsModal: React.FC<AiSettingsModalProps> = ({ onClose }) => {
  const { aiConfig, setAiConfig } = useTaskStore();
  const [url, setUrl] = useState(aiConfig.url);
  const [apiKey, setApiKey] = useState(aiConfig.apiKey);

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    setAiConfig({ url, apiKey });
    onClose();
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cấu hình AI</h2>
        <div className="form-group">
          <label htmlFor="ai-url">URL Endpoint</label>
          <input
            id="ai-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Nhập URL của bên thứ ba"
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
        <div className="modal-actions">
          <button onClick={handleClose} className="button-secondary ripple-btn">
            Hủy
          </button>
          <button onClick={handleSave} className="button-primary ripple-btn">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiSettingsModal;