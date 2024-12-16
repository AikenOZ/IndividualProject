import React, { useState } from 'react';
import { MODAL_OVERLAY_STYLES } from '@/utils/modalConstants';
import { LOGIC_OPERATORS, LOGIC_LABELS, LOGIC_BUTTONS } from '@/utils/logicConstants';

const LogicModal = ({ isOpen, onClose }) => {
  const [conditionType, setConditionType] = useState(LOGIC_OPERATORS[0].value);
  const [value, setValue] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (value.trim()) {
      alert(`Condition saved: ${conditionType} ${value}`);
      onClose();
    } else {
      alert('Please set a value for the condition.');
    }
  };

  return (
    <div className={MODAL_OVERLAY_STYLES}>
      <div className="bg-[#2B2B2B] p-8 rounded-lg w-[400px]">
        <h3 className="text-[#F5F5F5] text-xl font-semibold mb-4">
          {LOGIC_LABELS.HEADER}
        </h3>
        
        <div className="mb-4">
          <label className="text-[#F5F5F5] block mb-2">
            {LOGIC_LABELS.CONDITION_TYPE}
          </label>
          <select
            value={conditionType}
            onChange={(e) => setConditionType(e.target.value)}
            className="bg-[#3A3A3A] text-[#F5F5F5] px-4 py-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
          >
            {LOGIC_OPERATORS.map(operator => (
              <option key={operator.value} value={operator.value}>
                {operator.label}
              </option>
            ))}
          </select>
          
          <label className="text-[#F5F5F5] block mb-2">
            {LOGIC_LABELS.VALUE}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-[#3A3A3A] text-[#F5F5F5] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
            placeholder="Enter value..."
          />
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={onClose} 
            className="bg-[#FF4D00] text-white px-6 py-2 rounded hover:bg-[#cc3d00] transition-colors"
          >
            {LOGIC_BUTTONS.CANCEL}
          </button>
          <button 
            onClick={handleSave} 
            className="bg-[#FF6F00] text-white px-6 py-2 rounded hover:bg-[#cc5a00] transition-colors"
            disabled={!value.trim()}
          >
            {LOGIC_BUTTONS.SAVE}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogicModal;