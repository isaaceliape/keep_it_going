import React from "react";

interface ProgressBarProps {
  percent: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => (
  <div className="w-full bg-gray-200 rounded-full h-3">
    <div className="progress-bar" style={{ width: `${percent}%` }}></div>
  </div>
);

export default ProgressBar;
