import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={`
        rounded-2xl
        glass-card-light dark:glass-card-dark
        p-6
        transition-all duration-300
        ${hoverEffect ? 'hover:translate-y-[-4px] hover:shadow-lg dark:hover:shadow-indigo-950/20 hover:border-brand-300/40 dark:hover:border-brand-500/20' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
