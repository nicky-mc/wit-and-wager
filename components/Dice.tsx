import React, { useState } from 'react';

interface DiceProps {
  onRoll: (value: number) => void;
  disabled: boolean;
}

const Dice: React.FC<DiceProps> = ({ onRoll, disabled }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [value, setValue] = useState(1);

  const roll = () => {
    if (disabled || isRolling) return;
    
    setIsRolling(true);
    
    // Animate through random numbers
    let counter = 0;
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setValue(finalValue);
        setIsRolling(false);
        onRoll(finalValue);
      }
    }, 100);
  };

  return (
    <button
      onClick={roll}
      disabled={disabled || isRolling}
      className={`relative w-24 h-24 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.5)] transform transition-all duration-100 flex items-center justify-center border-4 border-gray-300
        ${isRolling ? 'animate-bounce' : ''}
        ${!disabled && !isRolling ? 'hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.8)] cursor-pointer' : 'opacity-50 cursor-not-allowed'}
      `}
    >
      <div className="text-6xl font-black text-arcade-dark select-none">
        {value}
      </div>
      {/* 3D edge effect */}
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gray-400 rounded-b-xl opacity-50"></div>
    </button>
  );
};

export default Dice;