import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

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

const pageTransition = {
  duration: 0.4,
  ease: 'easeInOut',
};

const ChatMessage = ({ message }) => {
  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  const isUser = message.sender === 'user';

  return (
    <motion.div
      className={`my-3 px-6 py-3 rounded-2xl max-w-[70%] break-words leading-relaxed ${
        isUser
          ? 'bg-[#3A3A3A] self-end text-white text-right'
          : 'bg-[#2B2B2B] self-start text-white text-left'
      }`}
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {message.text}
    </motion.div>
  );
};

function Canvas() {
  const navigate = useNavigate();
  const navControls = useAnimation();
  const [isExiting, setIsExiting] = useState(false);
  
  // Состояние ожидания ответа от AI
  const [awaitingAiResponse, setAwaitingAiResponse] = useState(false);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Привет! Я твой персональный помощник. Расскажи, какие у тебя цели в тренировках?' },
    { id: 2, sender: 'user', text: 'Привет! Хочу улучшить выносливость и сбросить вес.' },
    { id: 3, sender: 'ai', text: 'Отлично! Я могу составить для тебя программу тренировок. Есть ли у тебя предпочтения по типу занятий? Например: бег, велосипед, силовые?' },
  ]);

  const [inputValue, setInputValue] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    navControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    });
  }, [navControls]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBackClick = async () => {
    setIsExiting(true);
    await navControls.start({
      y: -20,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' },
    });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '' || awaitingAiResponse) return;
    const newMessage = { 
      id: Date.now(), 
      sender: 'user', 
      text: inputValue 
    };
    setMessages([...messages, newMessage]);
    setInputValue('');
    
    // Устанавливаем флаг ожидания ответа AI
    setAwaitingAiResponse(true);

    setTimeout(() => {
      const aiReply = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: 'Хорошо, я подготовлю для тебя программу. Один момент...' 
      };
      setMessages(prev => [...prev, aiReply]);
      
      // Ответ от AI получен, теперь можно отправлять новое сообщение
      setAwaitingAiResponse(false);
    }, 1000);
  };

  return (
    <>
      <style>{`
        /* Стилизация скроллбара */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2B2B2B;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FF4D00;
          border-radius: 3px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #FF4D00 #2B2B2B;
        }
      `}</style>
      <AnimatePresence mode="wait">
        <motion.div
          className="bg-[#1E1E1E] h-screen font-sans flex flex-col"
          variants={pageVariants}
          initial="initial"
          animate={isExiting ? "exit" : "animate"}
          exit="exit"
          transition={pageTransition}
          onAnimationComplete={() => isExiting && navigate('/')}
        >
          {/* Навигационная панель */}
          <motion.div
            className="border-b border-white/30"
            initial={{ y: -20, opacity: 0 }}
            animate={navControls}
          >
            <div className="py-6 flex justify-between items-center px-6">
              <motion.button
                onClick={handleBackClick}
                className="flex items-center gap-4 text-[#F5F5F5] text-xl font-light tracking-wide"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-[#F5F5F5] text-xl">←</span>
                <span>Назад</span>
              </motion.button>
              <motion.button
                className="bg-[#FF4D00] text-white px-6 py-2.5 rounded-lg text-[15px] font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Сохранить
              </motion.button>
            </div>
          </motion.div>

          {/* Чат */}
          <div ref={messagesEndRef} className="flex-grow overflow-y-auto w-full custom-scrollbar">
            <div className="max-w-3xl mx-auto w-full px-6 py-6 flex flex-col gap-2">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </div>
          </div>

          {/* Поле ввода снизу */}
          <div className="py-4 w-full px-6">
            <div className="max-w-3xl mx-auto w-full">
              <div className="flex items-center gap-2 bg-[#2B2B2B] rounded-2xl px-4 py-2">
                <input
                  className="flex-grow p-2 rounded-xl bg-[#2B2B2B] text-white focus:outline-none placeholder-gray-400"
                  placeholder="Напишите сообщение..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                  disabled={awaitingAiResponse} // блокируем ввод, пока ждем ответ
                />
                <motion.button
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    awaitingAiResponse || inputValue.trim() === ''
                      ? 'bg-[#2B2B2B] text-gray-500 cursor-not-allowed'
                      : 'bg-[#FF4D00] text-white hover:scale-105'
                  }`}
                  whileHover={!(awaitingAiResponse || inputValue.trim() === '') ? { scale: 1.05 } : {}}
                  whileTap={!(awaitingAiResponse || inputValue.trim() === '') ? { scale: 0.95 } : {}}
                  onClick={handleSendMessage}
                  disabled={awaitingAiResponse || inputValue.trim() === ''}
                >
                  →
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default Canvas;
