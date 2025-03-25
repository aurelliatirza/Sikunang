import React from "react";

interface CardStatsProps {
    statTitle: string;
    statAngka: number | string;
    statDesc: string;
  }
  
  const CardStats: React.FC<CardStatsProps> = ({ statTitle, statAngka, statDesc }) => {
    return (
      <div className="flex flex-col bg-white shadow-md rounded-lg p-4 w-full text-center">
        <h3 className="text-lg font-semibold text-gray-700">{statTitle}</h3>
        <p className="text-3xl font-bold text-blue-500">{statAngka}</p>
        <span className="text-sm text-gray-500">{statDesc}</span>
      </div>
    );
  };
  
  export default CardStats;
  