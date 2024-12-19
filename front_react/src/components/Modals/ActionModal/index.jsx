import React, { useState, useEffect } from 'react';
import '../DeviceModal/DeviceModal.css'; // Ваши стили и анимации Tailwind
import { useWorkout } from '../WorkoutContext';

// Категории данных о пользователе и соответствующие поля
const USER_CATEGORIES = {
  basic: {
    title: 'Основные показатели',
    fields: [
      { id: 'height', label: 'Рост (см)', placeholder: 'Введите ваш рост' },
      { id: 'weight', label: 'Вес (кг)', placeholder: 'Введите ваш вес' },
      { id: 'age', label: 'Возраст (лет)', placeholder: 'Введите ваш возраст' },
      { id: 'bodyFat', label: 'Процент жира (%)', placeholder: 'Введите процент жира в организме' },
    ],
  },
  proportions: {
    title: 'Пропорции тела',
    fields: [
      { id: 'chestCircumference', label: 'Обхват грудной клетки (см)', placeholder: 'Например: 100 см' },
      { id: 'waistCircumference', label: 'Обхват талии (см)', placeholder: 'Например: 80 см' },
      { id: 'hipsCircumference', label: 'Обхват бёдер (см)', placeholder: 'Например: 95 см' },
      { id: 'armCircumference', label: 'Обхват руки (см)', placeholder: 'Например: 35 см' },
    ],
  },
  strength: {
    title: 'Силовые показатели',
    fields: [
      { id: 'benchPress', label: 'Жим лёжа (кг)', placeholder: 'Максимальный или рабочий вес' },
      { id: 'squat', label: 'Присед (кг)', placeholder: 'Максимальный или рабочий вес' },
      { id: 'deadlift', label: 'Становая тяга (кг)', placeholder: 'Максимальный или рабочий вес' },
      { id: 'overheadPress', label: 'Жим стоя (кг)', placeholder: 'Максимальный или рабочий вес' },
    ],
  },
};

const ActionModal = ({ isOpen, onClose, onSubmit }) => {
  const { updateMetrics } = useWorkout();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [isForward, setIsForward] = useState(true);

  // Храним все данные о пользователе по категориям
  const [allFormData, setAllFormData] = useState({
    basic: {},
    proportions: {},
    strength: {}
  });

  // Храним информацию о том, какие категории завершены
  const [completedCategories, setCompletedCategories] = useState({
    basic: false,
    proportions: false,
    strength: false
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
      setShowCategoryForm(false);
      setSelectedCategory(null);
      setFormData({});
      setIsForward(true);
      setCompletedCategories({ basic: false, proportions: false, strength: false });
      setAllFormData({ basic: {}, proportions: {}, strength: {} });
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
      setShowCategoryForm(false);
      setSelectedCategory(null);
      setFormData({});
      setIsForward(true);
      setCompletedCategories({ basic: false, proportions: false, strength: false });
      setAllFormData({ basic: {}, proportions: {}, strength: {} });
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleFieldChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleBackClick = () => {
    setIsForward(false);
    setTimeout(() => {
      setShowCategoryForm(false);
      setFormData({});
      setIsForward(true);
      setSelectedCategory(null);
    }, 300);
  };

  const handleSaveData = () => {
    // Проверяем, что есть хотя бы одно заполненное поле
    if (Object.keys(formData).length > 0) {
      // Сохраняем данные в общий объект
      setAllFormData(prev => ({ ...prev, [selectedCategory]: formData }));
      // Отмечаем категорию как завершённую
      setCompletedCategories(prev => ({ ...prev, [selectedCategory]: true }));

      // Возвращаемся к выбору категории
      setShowCategoryForm(false);
      setSelectedCategory(null);
      setFormData({});
      setIsForward(true);
    } else {
      alert('Пожалуйста, заполните хотя бы одно поле');
    }
  };

  const handleFinalSubmit = async () => {
    try {
      await updateMetrics(allFormData);
      onSubmit?.(allFormData);
      handleClose();
    } catch (error) {
      console.error('Ошибка при сохранении метрик:', error);
      // Здесь можно добавить уведомление пользователю
    }
  };

  const isAnyCategoryCompleted = Object.values(completedCategories).some(v => v === true);

  const renderCategorySelection = () => (
    <div className="p-6 space-y-6">
      <div className="space-y-1 animate-fadeIn">
        <h2 className="text-[#F5F5F5] text-xl font-medium text-center">Выбор категории данных</h2>
        <p className="text-gray-400 text-sm text-center">
          Выберите категорию, на основе данных ИИ поможет вам
        </p>
      </div>

      <div className="flex flex-col items-center space-y-3">
        {Object.entries(USER_CATEGORIES).map(([catKey, catData]) => (
          <button
            key={catKey}
            onClick={() => {
              setSelectedCategory(catKey);
              setIsForward(true);
              setShowCategoryForm(true);
            }}
            className={`px-4 py-3 text-white font-medium bg-[#2B2B2B] rounded-lg hover:bg-[#323232] transition-all duration-300 w-full max-w-sm text-left ${completedCategories[catKey] ? 'ring-2 ring-purple-600' : ''
              }`}
          >
            {catData.title} {completedCategories[catKey] && '✓'}
          </button>
        ))}
      </div>

      <div className="flex justify-between border-t border-[#2B2B2B] pt-4">
        <button
          onClick={handleClose}
          className="px-8 py-4 text-gray-400 text-base font-medium bg-[#1C1C1C] rounded-lg transition-all duration-300 hover:bg-[#2B2B2B] hover:text-white"
          style={{ width: '45%', fontSize: '16px', padding: '16px' }}
        >
          Закрыть
        </button>
        <button
          disabled={!isAnyCategoryCompleted}
          onClick={handleFinalSubmit}
          className={`px-8 py-4 text-base font-medium rounded-lg transition-all duration-300 ${isAnyCategoryCompleted
            ? 'text-white bg-purple-600 hover:bg-purple-700'
            : 'text-gray-400 bg-[#2B2B2B] cursor-not-allowed'
            }`}
          style={{ width: '45%', fontSize: '16px', padding: '16px' }}
        >
          Далее
        </button>
      </div>
    </div>
  );

  const renderCategoryForm = () => {
    const categoryData = USER_CATEGORIES[selectedCategory];

    return (
      <div className="p-6 space-y-6">
        <div className="space-y-1 animate-fadeIn">
          <h2 className="text-[#F5F5F5] text-xl font-medium text-center">{categoryData.title}</h2>
          <p className="text-gray-400 text-sm text-center">
            Заполните данные для категории "{categoryData.title}"
          </p>
        </div>

        <div className="space-y-4 animate-slideInRight" style={{ '--delay': '0.1s' }}>
          {categoryData.fields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-400 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                id={field.id}
                value={formData[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="w-full bg-[#2B2B2B] text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6 animate-slideInLeft" style={{ '--delay': '0.2s' }}>
          <button
            onClick={handleBackClick}
            className="px-8 py-4 text-gray-400 text-base font-medium bg-[#1C1C1C] rounded-lg transition-all duration-300 hover:bg-[#2B2B2B] hover:text-white"
            style={{ width: '45%', fontSize: '16px', padding: '16px' }}
          >
            Назад
          </button>
          <button
            onClick={handleSaveData}
            className={`px-8 py-4 text-base font-medium rounded-lg transition-all duration-300 ${Object.keys(formData).length > 0
              ? 'text-white bg-purple-600 hover:bg-purple-700'
              : 'text-gray-400 bg-[#2B2B2B] cursor-not-allowed'
              }`}
            disabled={Object.keys(formData).length === 0}
            style={{ width: '45%', fontSize: '16px', padding: '16px' }}
          >
            Сохранить
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleOverlayClick}
    >
      <div
        className={`modal-content bg-[#1C1C1C] rounded-xl w-full max-w-md overflow-hidden transform transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
          } ${showCategoryForm
            ? (isForward ? 'animate-slideInRight' : 'animate-slideOutRight')
            : (isForward ? 'animate-slideInLeft' : 'animate-slideOutLeft')
          }`}
        onClick={(e) => e.stopPropagation()}
        style={{ '--delay': '0s' }}
      >
        {showCategoryForm ? renderCategoryForm() : renderCategorySelection()}
      </div>
    </div>
  );
};

export default ActionModal;