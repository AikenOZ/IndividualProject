import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeviceModal.css';
import { useWorkout } from '../WorkoutContext';

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

const DeviceModal = ({ isOpen, onClose }) => {
  const { updateMuscles } = useWorkout();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      checkAuth();
    } else {
      setTimeout(() => setIsVisible(false), 300);
      resetState();
    }
  }, [isOpen]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth/signin');
      return false;
    }
    return true;
  };

  const resetState = () => {
    setSelectedMuscles([]);
    setCurrentCategory(null);
    setAllSelected({ upper: [], core: [], lower: [] });
    setCompletedCategories({ upper: false, core: false, lower: false });
    setError(null);
    setIsLoading(false);
  };

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
    if (isLoading) return;

    setSelectedMuscles(prev => {
      const exists = prev.find(m => m.id === muscle.id);
      if (exists) {
        return prev.filter(m => m.id !== muscle.id);
      }
      return [...prev, muscle];
    });
  };

  const handleSaveCategory = () => {
    if (!currentCategory || isLoading) return;

    setAllSelected(prev => ({ ...prev, [currentCategory]: selectedMuscles }));
    setCompletedCategories(prev => ({ ...prev, [currentCategory]: selectedMuscles.length > 0 }));
    setCurrentCategory(null);
    setSelectedMuscles([]);
  };

  const handleFinalSubmit = async () => {
    if (!checkAuth()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await updateMuscles(allSelected);

      if (result.status === 'success') {
        // Просто закрываем модальное окно
        handleClose();
      } else {
        console.error('Error response:', result);
        setError(result.message || 'Произошла ошибка при сохранении');
      }
    } catch (error) {
      console.error('Error in handleFinalSubmit:', error);
      setError('Произошла ошибка при сохранении данных');
    } finally {
      setIsLoading(false);
    }
  };

  const isAnyCategoryCompleted = Object.values(completedCategories).some(v => v);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
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
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-grow overflow-auto">
          <div className="space-y-2 flex-shrink-0 mb-4 text-center animate-fadeIn">
            <h2 className="text-white text-xl font-medium">Выбор групп мышц</h2>
            <p className="text-gray-400 text-sm">
              Выберите категорию, затем мышечные группы
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-500">
              {error}
            </div>
          )}

          {!currentCategory ? (
            <div className="animate-fadeInScale mt-2 px-4 py-4 space-y-3">
              {Object.entries(CATEGORIES).map(([catKey, catData]) => (
                <button
                  key={catKey}
                  onClick={() => {
                    setCurrentCategory(catKey);
                    setSelectedMuscles(allSelected[catKey] || []);
                  }}
                  disabled={isLoading}
                  className={`px-4 py-3 text-white font-medium bg-[#2B2B2B] rounded-lg hover:bg-[#323232] transition-all duration-300 w-full text-left ${completedCategories[catKey] ? 'ring-2 ring-purple-600' : ''
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {catData.title} {completedCategories[catKey] && '✓'}
                </button>
              ))}
            </div>
          ) : (
            <div className="animate-fadeInScale">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    setCurrentCategory(null);
                    setSelectedMuscles([]);
                  }}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  ← Назад
                </button>
                <h3 className="text-gray-300 text-lg font-semibold">
                  {CATEGORIES[currentCategory].title}
                </h3>
                <div className="w-10" />
              </div>

              <div className="overflow-y-auto max-h-64 px-4 py-4 space-y-3">
                {CATEGORIES[currentCategory].muscles.map((muscle) => (
                  <button
                    key={muscle.id}
                    onClick={() => toggleMuscleSelection(muscle)}
                    disabled={isLoading}
                    className={`group w-full p-4 rounded-lg bg-[#2B2B2B] border border-[#3A3A3A] transition-all duration-300 transform hover:-translate-y-1 hover:bg-[#323232] ${selectedMuscles.find(m => m.id === muscle.id)
                      ? 'ring-2 ring-purple-600 shadow-lg shadow-purple-600/20'
                      : ''
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="text-left transition-colors duration-300 max-w-full">
                      <p className={`text-base font-medium transition-colors duration-300 ${selectedMuscles.find(m => m.id === muscle.id)
                        ? 'text-purple-500'
                        : 'text-white group-hover:text-purple-500'
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
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 border-t border-[#2B2B2B] pt-4 flex justify-between mt-4">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className={`px-8 py-4 text-gray-400 text-base font-medium bg-[#1C1C1C] rounded-lg transition-all duration-300 hover:bg-[#2B2B2B] hover:text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            style={{ width: '45%' }}
          >
            Закрыть
          </button>
          <button
            onClick={currentCategory ? handleSaveCategory : handleFinalSubmit}
            disabled={currentCategory ? selectedMuscles.length === 0 : !isAnyCategoryCompleted || isLoading}
            className={`px-8 py-4 text-base font-medium rounded-lg transition-all duration-300 ${(currentCategory ? selectedMuscles.length > 0 : isAnyCategoryCompleted) && !isLoading
              ? 'text-white bg-purple-600 hover:bg-purple-700'
              : 'text-gray-400 bg-[#2B2B2B] cursor-not-allowed'
              }`}
            style={{ width: '45%' }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              currentCategory ? 'Выбрать' : 'Далее'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceModal;