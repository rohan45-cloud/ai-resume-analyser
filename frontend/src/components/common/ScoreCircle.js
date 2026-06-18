import React from 'react';

const ScoreCircle = ({ score, size = 140, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 85) return { stroke: '#16a34a', text: 'text-green-600', label: 'Excellent', bg: 'bg-green-50' };
    if (s >= 70) return { stroke: '#2563eb', text: 'text-blue-600', label: 'Good', bg: 'bg-blue-50' };
    if (s >= 50) return { stroke: '#d97706', text: 'text-amber-600', label: 'Average', bg: 'bg-amber-50' };
    return { stroke: '#dc2626', text: 'text-red-600', label: 'Poor', bg: 'bg-red-50' };
  };

  const colors = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={colors.stroke} strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colors.text}`}>{score}</span>
          <span className="text-xs text-gray-400 font-medium">/100</span>
        </div>
      </div>
      <span className={`${colors.bg} ${colors.text} text-xs font-semibold px-3 py-1 rounded-full`}>
        {colors.label}
      </span>
    </div>
  );
};

export default ScoreCircle;
