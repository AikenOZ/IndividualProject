import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api';

const pageVariants = {
    initial: {
        opacity: 0,
        filter: 'blur(10px)',
    },
    animate: {
        opacity: 1,
        filter: 'blur(0px)',
    },
    exit: {
        opacity: 0,
        filter: 'blur(10px)',
    },
};

const formVariants = {
    initial: {
        y: 20,
        opacity: 0
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
};

const SignInPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            console.log('Sending login request with data:', formData);

            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (!response.ok) {
                if (data.errors) {
                    const errorMessages = Object.entries(data.errors)
                        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                        .join('\n');
                    throw new Error(errorMessages);
                }
                throw new Error(data.message || 'Ошибка при входе');
            }

            // Проверяем наличие токена в ответе
            if (!data.data?.token) {
                throw new Error('Токен не получен от сервера');
            }

            // Сохраняем токен в localStorage
            localStorage.setItem('token', data.data.token);
            console.log('Token saved:', data.data.token);

            // Сохраняем данные пользователя
            if (data.data.user) {
                localStorage.setItem('user', JSON.stringify(data.data.user));
            }

            // Сохраняем время жизни токена, если оно есть
            if (data.data.expires_in) {
                const expiresAt = new Date().getTime() + data.data.expires_in * 1000;
                localStorage.setItem('token_expires_at', expiresAt.toString());
            }

            console.log('Login successful, redirecting to home page');
            navigate('/');

        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Произошла ошибка при входе');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Сбрасываем ошибку при изменении полей
        setError(null);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
                <motion.div
                    className="w-full max-w-md"
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                >
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-light text-gray-800 mb-2">
                                Вход в систему
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Войдите в свою учетную запись, чтобы продолжить
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Введите ваш email"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Пароль
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Введите ваш пароль"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember" className="ml-2 text-gray-600">
                                        Запомнить меня
                                    </label>
                                </div>
                                <motion.button
                                    type="button"
                                    onClick={() => navigate('/auth/forgot-password')}
                                    className="text-purple-600 hover:text-purple-700 font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Забыли пароль?
                                </motion.button>
                            </div>

                            <motion.button
                                type="submit"
                                className={`w-full py-3 px-6 rounded-lg text-white font-medium 
                                    ${isLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} 
                                    transition-colors flex items-center justify-center`}
                                whileHover={!isLoading ? { scale: 1.02 } : {}}
                                whileTap={!isLoading ? { scale: 0.98 } : {}}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                ) : (
                                    'Войти'
                                )}
                            </motion.button>
                        </form>
                    </div>

                    <div className="text-center space-y-4">
                        <p className="text-gray-600 text-sm">
                            Нет аккаунта?{' '}
                            <motion.button
                                onClick={() => navigate('/auth/signup')}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Зарегистрироваться
                            </motion.button>
                        </p>
                        <motion.button
                            onClick={() => navigate('/')}
                            className="text-gray-600 hover:text-purple-600 text-sm font-medium transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ← Вернуться на главную
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SignInPage;