import React from 'react';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator: React.FC<SeparatorProps> = ({
  className = '',
  orientation = 'horizontal',
  decorative = true,
  ...props
}) => {
  const baseStyles = 'shrink-0 bg-border';
  const orientationStyles = {
    horizontal: 'h-[1px] w-full',
    vertical: 'h-full w-[1px]'
  };

  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={orientation}
      className={`${baseStyles} ${orientationStyles[orientation]} ${className}`}
      {...props}
    />
  );
};
