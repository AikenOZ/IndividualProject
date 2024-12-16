import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ options, value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const dropdownVariants = {
        hidden: {
            opacity: 0,
            y: -5,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.2,
                ease: "easeOut",
            }
        },
        exit: {
            opacity: 0,
            y: -5,
            scale: 0.95,
            transition: {
                duration: 0.15,
                ease: "easeIn",
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            x: -4,
        },
        visible: (custom) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: custom * 0.03,
                duration: 0.15,
            }
        }),
        hover: {
            x: 2,
            transition: {
                duration: 0.2,
            }
        }
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-2.5 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] 
                text-left flex items-center justify-between text-[#F5F5F5] 
                hover:bg-[#333333] focus:outline-none transition-all duration-200
                ${isOpen ? 'ring-2 ring-[#FF4D00] ring-opacity-50' : ''}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <span className="text-sm font-medium truncate">{value || label}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4 text-[#808080]" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute z-[100] w-full mt-2 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] shadow-lg overflow-hidden"
                    >
                        <div className="max-h-[240px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                            {options.map((option, index) => (
                                <motion.button
                                    key={option}
                                    custom={index}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150
                                        ${value === option
                                            ? 'bg-[#FF4D00] text-white'
                                            : 'text-[#F5F5F5] hover:bg-[#333333]'
                                        }`}
                                >
                                    <span className="block truncate">{option}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 4px; // Уменьшаем ширину скроллбара
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent; // Оставляем трек прозрачным
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1); // Полупрозрачный белый цвет
                border-radius: 2px; // Уменьшаем радиус скругления
                transition: background 0.3s ease; // Добавляем плавный переход
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3); // Увеличиваем яркость при наведении
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); // Добавляем легкое свечение
            }
        `}</style>
        </div>
    );
};

export default CustomDropdown;