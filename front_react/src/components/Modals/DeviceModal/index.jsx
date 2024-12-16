import React, { useState, useEffect } from 'react';
import './DeviceModal.css'; // Ваши стили и анимации Tailwind

const CATEGORIES = {
  upper: {
    title: 'Верх тела',
    muscles: [
      { id: 'chest-upper', name: 'Грудь (верх)', description: 'Верхние пучки грудных мышц' },
      { id: 'chest-middle', name: 'Грудь (середина)', description: 'Средняя часть грудных мышц' },
      { id: 'chest-lower', name: 'Грудь (низ)', description: 'Нижние пучки грудных мышц' },
      { id: 'lats', name: 'Широчайшие', description: 'Широчайшие мышцы спины' },
      { id: 'traps', name: 'Трапеции', description: 'Верхняя часть трапеций' },
      { id: 'rhomboids', name: 'Ромбовидные', description: 'Глубокие мышцы спины' },
      { id: 'middle-delts', name: 'Средние дельты', description: 'Средние пучки дельтовидных мышц' },
      { id: 'rear-delts', name: 'Задние дельты', description: 'Задние пучки дельтовидных мышц' },
      { id: 'biceps', name: 'Бицепсы', description: 'Двуглавая мышца плеча' },
      { id: 'triceps', name: 'Трицепсы', description: 'Трёхглавая мышца плеча' },
      { id: 'forearms', name: 'Предплечья', description: 'Сгибатели и разгибатели предплечья' }
    ]
  },
  core: {
    title: 'Корпус',
    muscles: [
      { id: 'abs', name: 'Пресс (прямой)', description: 'Прямая мышца живота' },
      { id: 'obliques', name: 'Косые мышцы живота', description: 'Наружные и внутренние косые' },
      { id: 'transverse-abs', name: 'Поперечные мышцы живота', description: 'Глубокий слой мышц пресса' }
    ]
  },
  lower: {
    title: 'Низ тела',
    muscles: [
      { id: 'glutes', name: 'Ягодицы', description: 'Большая, средняя и малая ягодичные мышцы' },
      { id: 'hamstrings', name: 'Бицепс бедра', description: 'Задняя часть бедра' },
      { id: 'quadriceps', name: 'Квадрицепсы', description: 'Четырёхглавая мышца бедра' },
      { id: 'calves', name: 'Икры', description: 'Икроножная и камбаловидная мышцы' }
    ]
  }
};

const DeviceModal = ({ isOpen, onClose, onSubmit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [allSelected, setAllSelected] = useState({
    upper: [],
    core: [],
    lower: []
  });

  const [completedCategories, setCompletedCategories] = useState({
    upper: false,
    core: false,
    lower: false
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
      setSelectedMuscles([]);
      setCurrentCategory(null);
      setAllSelected({ upper: [], core: [], lower: [] });
      setCompletedCategories({ upper: false, core: false, lower: false });
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

  const handleClose = () => {
    const modal = document.querySelector('.modal-content');
    if (modal) {
      modal.classList.add('modal-exit');
    }
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const toggleMuscleSelection = (muscle) => {
    setSelectedMuscles(prevSelected => {
      const exists = prevSelected.find(m => m.id === muscle.id);
      if (exists) {
        return prevSelected.filter(m => m.id !== muscle.id);
      } else {
        return [...prevSelected, muscle];
      }
    });
  };

  const handleSaveCategory = () => {
    if (currentCategory) {
      setAllSelected(prev => ({ ...prev, [currentCategory]: selectedMuscles }));
      setCompletedCategories(prev => ({ ...prev, [currentCategory]: selectedMuscles.length > 0 }));
    }
    setCurrentCategory(null);
    setSelectedMuscles([]);
  };

  const handleFinalSubmit = () => {
    const allMusclesSelected = {
      upper: allSelected.upper,
      core: allSelected.core,
      lower: allSelected.lower
    };
    onSubmit(allMusclesSelected);
    handleClose();
  };

  const isAnyCategoryCompleted = Object.values(completedCategories).some(v => v);

  const renderCategorySelection = () => (
    <div className="animate-fadeInScale mt-2 px-4 py-4 space-y-3">
      {Object.entries(CATEGORIES).map(([catKey, catData]) => (
        <button
          key={catKey}
          onClick={() => {
            setCurrentCategory(catKey);
            setSelectedMuscles(allSelected[catKey] || []);
          }}
          className={`px-4 py-3 text-white font-medium bg-[#2B2B2B] rounded-lg hover:bg-[#323232] transition-all duration-300 w-full text-left ${completedCategories[catKey] ? 'ring-2 ring-[#FF4D00]' : ''
            }`}
        >
          {catData.title} {completedCategories[catKey] && '✓'}
        </button>
      ))}
    </div>
  );

  const renderMuscleButtons = (muscles) => {
    return muscles.map((muscle, index) => (
      <button
        key={muscle.id}
        onClick={() => toggleMuscleSelection(muscle)}
        onMouseEnter={() => setHighlightedMuscle(muscle.id)}
        onMouseLeave={() => setHighlightedMuscle(null)}
        className={`group w-full p-4 rounded-lg bg-[#2B2B2B] border border-[#3A3A3A] transition-all duration-300 transform hover:-translate-y-1 hover:bg-[#323232] ${selectedMuscles.find(m => m.id === muscle.id)
            ? 'ring-2 ring-[#FF4D00] shadow-lg shadow-[#FF4D00]/20'
            : ''
          }`}
        style={{ '--delay': `${0.3 + index * 0.05}s` }}
      >
        <div className="text-left transition-colors duration-300 max-w-full">
          <p className={`text-base font-medium transition-colors duration-300 ${selectedMuscles.find(m => m.id === muscle.id)
              ? 'text-[#FF4D00]'
              : 'text-white group-hover:text-[#FF4D00]'
            }`}>
            {muscle.name}
          </p>
          <p className={`text-sm transition-colors duration-300 mt-1 ${selectedMuscles.find(m => m.id === muscle.id)
              ? 'text-white'
              : 'text-gray-400 group-hover:text-white'
            }`}>
            {muscle.description}
          </p>
        </div>
      </button>
    ));
  };

  const renderMuscleSelection = () => {
    const categoryData = CATEGORIES[currentCategory];
    return (
      <div className="animate-fadeInScale">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              setCurrentCategory(null);
              setSelectedMuscles([]);
            }}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            ← Назад
          </button>
          <h3 className="text-gray-300 text-lg font-semibold">{categoryData.title}</h3>
          <div className="w-10" />
        </div>
        <div className="overflow-y-auto max-h-64 px-4 py-4 space-y-3">
          {renderMuscleButtons(categoryData.muscles)}
        </div>
      </div>
    );
  };

  if (!isOpen && !isVisible) return null;

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
        className={`modal-content bg-[#1C1C1C] rounded-xl w-[450px] max-h-[70vh] transform transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
          } p-5 flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-grow overflow-auto">
          <div className="space-y-2 flex-shrink-0 mb-4 text-center animate-fadeIn">
            <h2 className="text-white text-xl font-medium">Выбор групп мышц</h2>
            <p className="text-gray-400 text-sm">
              Выберите категорию, затем мышечные группы
            </p>
          </div>
          {!currentCategory && renderCategorySelection()}
          {currentCategory && renderMuscleSelection()}
        </div>

        <div className="flex-shrink-0 border-t border-[#2B2B2B] pt-4 flex justify-between mt-4">
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
            onClick={
              currentCategory
                ? handleSaveCategory
                : (isAnyCategoryCompleted ? handleFinalSubmit : undefined)
            }
            disabled={
              currentCategory
                ? selectedMuscles.length === 0
                : !isAnyCategoryCompleted
            }
            className={`px-8 py-4 text-base font-medium rounded-lg transition-all duration-300 ${currentCategory
                ? (selectedMuscles.length > 0
                  ? 'text-white bg-[#FF4D00] hover:bg-[#FF6A00]'
                  : 'text-gray-400 bg-[#2B2B2B] cursor-not-allowed')
                : (isAnyCategoryCompleted
                  ? 'text-white bg-[#FF4D00] hover:bg-[#FF6A00]'
                  : 'text-gray-400 bg-[#2B2B2B] cursor-not-allowed')
              }`}
            style={{
              width: '45%',
              fontSize: '16px',
              padding: '16px',
            }}
          >
            {currentCategory ? 'Выбрать' : 'Далее'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeviceModal;
