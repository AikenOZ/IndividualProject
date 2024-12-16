import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import IndexPage from './pages';
import IndexRulesPage from './pages/index_rules';
import AddRule from './pages/add_rule';
import Canvas from './pages/canvas';

function App() {
  const location = useLocation();
  const [hasRules, setHasRules] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkStorage = async () => {
      try {
        const response = await import('@/utils/storage.json');
        const data = response.default;

        if (isMounted) {
          const userRules = data?.user?.rules;
          setHasRules(Array.isArray(userRules) && userRules.length > 0);
          setError(null);
        }
      } catch (error) {
        console.error('Failed to load user rules:', error);
        if (isMounted) {
          setError('Failed to load user data');
          setHasRules(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkStorage();

    return () => {
      isMounted = false;
    };
  }, []);

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

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={hasRules ? <IndexRulesPage /> : <IndexPage />}
        />
        <Route path="/add-rule" element={<AddRule />} />
        <Route path="/add-rule/canvas" element={<Canvas />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
