// src/components/DashboardCard.tsx
import React from "react";

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function DashboardCard({
  children,
  className = "",
  style = {},
}: DashboardCardProps) {
  return (
    <div
      className={`bg-background border border-white rounded-xl shadow transition-all duration-200 hover:shadow-2xl hover:bg-blue/10 hover:scale-105 p-4 ${className}`}
      style={{ minHeight: 120, ...style }}
    >
      {children}
    </div>
  );
}
