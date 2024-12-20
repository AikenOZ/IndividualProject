import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { WorkoutProvider } from './components/Modals/WorkoutContext';
import IndexPage from './pages';
import AddRule from './pages/add_rule';
import Canvas from './pages/canvas';
import SignInPage from './pages/auth/signin';
import SignUpPage from './pages/auth/signup';

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return children;
};

// Компонент для публичных маршрутов (доступных только неавторизованным)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const [hasRules, setHasRules] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        // Проверяем авторизацию
        const token = localStorage.getItem('token');

        if (token) {
          try {
            // Здесь можно добавить проверку валидности токена через API
            const response = await fetch('http://127.0.0.1:8000/api/me', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              }
            });

            if (!response.ok) {
              throw new Error('Invalid token');
            }
          } catch (error) {
            console.error('Token validation failed:', error);
            localStorage.removeItem('token');
          }
        }

        // Загружаем правила пользователя
        const response = await import('@/utils/storage.json');
        const data = response.default;

        if (isMounted) {
          const userRules = data?.user?.rules;
          setHasRules(Array.isArray(userRules) && userRules.length > 0);
          setError(null);
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        if (isMounted) {
          setError('Failed to load application data');
          setHasRules(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  // Компонент загрузки
  if (isLoading) {
    return (
      <div className="bg-[#1E1E1E] h-screen flex items-center justify-center text-[#F5F5F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-light">Loading...</p>
        </div>
      </div>
    );
  }

  // Компонент ошибки
  if (error) {
    return (
      <div className="bg-[#1E1E1E] h-screen flex items-center justify-center text-[#F5F5F5]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-light text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FF4D00] rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Основной рендер приложения
  return (
    <WorkoutProvider>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Публичные маршруты */}
          <Route
            path="/auth/signin"
            element={
              <PublicRoute>
                <SignInPage />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />

          {/* Защищенные маршруты */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <IndexPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-rule"
            element={
              <ProtectedRoute>
                <AddRule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-rule/canvas"
            element={
              <ProtectedRoute>
                <Canvas />
              </ProtectedRoute>
            }
          />

          {/* Редирект для несуществующих маршрутов */}
          <Route
            path="*"
            element={
              isInitialized ? (
                <Navigate to="/" replace />
              ) : (
                <div className="bg-[#1E1E1E] h-screen flex items-center justify-center text-[#F5F5F5]">
                  <div className="w-8 h-8 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
                </div>
              )
            }
          />
        </Routes>
      </AnimatePresence>
    </WorkoutProvider>
  );
}

export default App;