import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = '',
  size = 24
}) => {
  // Fallback to HelpCircle if icon name is missing or invalid
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;

  return <IconComponent className={className} size={size} />;
};
export default DynamicIcon;
