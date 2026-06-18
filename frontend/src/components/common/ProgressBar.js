import React, { useEffect, useState } from 'react';

const ProgressBar = ({ value, max = 100, color = 'blue', label, showValue = true, animated = true }) => {
  const [width, setWidth] = useState(0);
  const percentage = Math.round((value / max) * 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setWidth(percentage), 100);
      return () => clearTimeout(timer);
    } else {
      setWidth(percentage);
    }
  }, [percentage, animated]);

  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && <span className="text-sm font-semibold text-gray-900">{percentage}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorMap[color] || colorMap.blue}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
