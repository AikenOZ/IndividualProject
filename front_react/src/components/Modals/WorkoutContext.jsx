import React, { createContext, useContext, useState, useCallback } from 'react';

const WorkoutContext = createContext();
const API_URL = 'http://127.0.0.1:8000/api';

export const WorkoutProvider = ({ children }) => {
  const [workoutData, setWorkoutData] = useState({
    muscles: {
      upper: [],
      core: [],
      lower: []
    },
    metrics: {
      basic: {},
      proportions: {},
      strength: {}
    },
    meta: {
      id: null,
      name: '',
      description: '',
      createdAt: null
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Не найден токен авторизации');
    }
    return token;
  }, []);

  const getHeaders = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Токен не найден');
      }
      return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}` // Убедитесь, что формат именно такой
      };
    } catch (error) {
      console.error('Error getting headers:', error);
      return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    }
  }, []);

  const handleApiError = useCallback((error) => {
    console.error('API Error:', error);
    setError(error.message || 'Произошла ошибка при обработке запроса');
    return {
      status: 'error',
      message: error.message || 'Произошла ошибка при обработке запроса'
    };
  }, []);

  const checkApiResponse = useCallback(async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка HTTP: ${response.status}`);
    }
    return await response.json();
  }, []);

  const updateMuscles = useCallback(async (muscles) => {
    setIsLoading(true);
    setError(null);

    try {
      const formattedData = Object.entries(muscles).reduce((acc, [category, muscleList]) => {
        if (Array.isArray(muscleList) && muscleList.length > 0) {
          acc[category] = muscleList.map(muscle => ({
            id: muscle.id,
            name: muscle.name
          }));
        }
        return acc;
      }, {});

      const response = await fetch(`${API_URL}/muscles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formattedData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'API request failed');
      }

      setWorkoutData(prev => ({
        ...prev,
        muscles
      }));

      return result;

    } catch (error) {
      console.error('API Error:', error);
      return {
        status: 'error',
        message: error.message
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMetrics = useCallback(async (metrics) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/metrics`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(metrics)
      });

      const result = await checkApiResponse(response);

      setWorkoutData(prev => ({
        ...prev,
        metrics
      }));

      return {
        status: 'success',
        data: result
      };

    } catch (error) {
      return handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders, checkApiResponse, handleApiError]);

  const saveWorkout = useCallback(async (name, description) => {
    setIsLoading(true);
    setError(null);

    try {
      const workoutToSave = {
        name,
        description,
        muscles: workoutData.muscles,
        metrics: workoutData.metrics,
        created_at: new Date().toISOString()
      };

      const response = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(workoutToSave)
      });

      const result = await checkApiResponse(response);

      setWorkoutData(prev => ({
        ...prev,
        meta: {
          id: result.data?.workout_id,
          name,
          description,
          createdAt: new Date().toISOString()
        }
      }));

      return {
        status: 'success',
        data: result
      };

    } catch (error) {
      return handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  }, [workoutData, getHeaders, checkApiResponse, handleApiError]);

  const loadWorkouts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'GET',
        headers: getHeaders()
      });

      const result = await checkApiResponse(response);
      return {
        status: 'success',
        data: result
      };

    } catch (error) {
      return handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders, checkApiResponse, handleApiError]);

  const loadUserMuscles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/muscles`, {
        method: 'GET',
        headers: getHeaders()
      });

      const result = await checkApiResponse(response);

      if (result.data) {
        setWorkoutData(prev => ({
          ...prev,
          muscles: result.data
        }));
      }

      return {
        status: 'success',
        data: result
      };

    } catch (error) {
      return handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders, checkApiResponse, handleApiError]);

  const clearWorkoutData = useCallback(() => {
    setWorkoutData({
      muscles: {
        upper: [],
        core: [],
        lower: []
      },
      metrics: {
        basic: {},
        proportions: {},
        strength: {}
      },
      meta: {
        id: null,
        name: '',
        description: '',
        createdAt: null
      }
    });
    setError(null);
  }, []);

  const contextValue = {
    workoutData,
    isLoading,
    error,
    updateMuscles,
    updateMetrics,
    saveWorkout,
    loadWorkouts,
    loadUserMuscles,
    clearWorkoutData
  };

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export default WorkoutContext;