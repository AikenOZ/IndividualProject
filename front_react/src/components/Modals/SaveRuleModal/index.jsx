import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SAVE_RULE_PLACEHOLDERS, SAVE_RULE_LABELS, SAVE_RULE_BUTTONS } from '@/utils/saveRuleConstants';

const SaveRuleModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); // Инициализация useNavigate
  const [ruleName, setRuleName] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setRuleName('');
      setRuleDescription('');
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const saveRuleToJson = () => {
    const ruleData = {
      name: ruleName,
      description: ruleDescription,
      createdAt: new Date().toISOString()
    };

    try {
      const existingRules = JSON.parse(localStorage.getItem('rules')) || [];
      existingRules.push(ruleData);
      localStorage.setItem('rules', JSON.stringify(existingRules));
    } catch (error) {
      console.error('Error saving rule:', error);
      alert('Failed to save rule');
    }
  };

  const handleSave = () => {
    if (ruleName.trim()) {
      saveRuleToJson();
      navigate('/index-rules'); // Редирект на index_rules.jsx
    } else {
      alert('Please provide a rule name.');
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleOverlayClick}
    >
      <div
        className={`modal-content bg-[#1C1C1C] rounded-xl w-full max-w-md overflow-hidden transform transition-all duration-300 ${
          isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ '--delay': '0s' }}
      >
        <div className="p-6 space-y-6">
          <div className="space-y-1 animate-fadeIn">
            <h2 className="text-[#F5F5F5] text-xl font-medium text-center">Создать тренировку</h2>
            <p className="text-gray-400 text-sm text-center">
              Заполните информацию о вашей тренировке
            </p>
          </div>

          <div className="space-y-4 animate-slideInRight" style={{ '--delay': '0.1s' }}>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Название тренировки
              </label>
              <input
                type="text"
                placeholder="Введите название тренировки"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full bg-[#2B2B2B] text-white px-4 py-3 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Описание
              </label>
              <textarea
                placeholder="Введите описание тренировки"
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
                className="w-full bg-[#2B2B2B] text-white px-4 py-3 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF4D00] h-32 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-between border-t border-[#2B2B2B] pt-4 animate-slideInLeft" style={{ '--delay': '0.2s' }}>
            <button
              onClick={handleClose}
              className="px-8 py-4 text-gray-400 text-base font-medium bg-[#1C1C1C] rounded-lg transition-all duration-300 hover:bg-[#2B2B2B] hover:text-white"
              style={{
                width: '45%',
                fontSize: '16px',
                padding: '16px',
              }}
            >
              Закрыть
            </button>
            <button
              onClick={handleSave}
              className={`px-8 py-4 text-base font-medium rounded-lg transition-all duration-300 ${
                ruleName.trim()
                  ? 'text-white bg-[#FF4D00] hover:bg-[#FF6A00]'
                  : 'text-gray-400 bg-[#2B2B2B] cursor-not-allowed'
              }`}
              style={{
                width: '45%',
                fontSize: '16px',
                padding: '16px',
              }}
            >
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveRuleModal;
