'use client';

import React from 'react';

interface MovingBorderCardProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
  as?: React.ElementType;
  containerClassName?: string;
  duration?: number;
  href?: string;
}

export default function MovingBorderCard({
  children,
  className = '',
  borderRadius = '0.75rem',
  as: Component = 'div',
  containerClassName = '',
  duration = 3000,
  href,
}: MovingBorderCardProps) {
  const containerProps: Record<string, unknown> = {
    className: `moving-border-card group relative p-[2px] ${containerClassName}`,
    style: {
      borderRadius,
      '--mb-duration': `${duration}ms`,
    } as React.CSSProperties,
  };

  if (href) containerProps.href = href;

  return (
    <Component {...containerProps}>
      <div
        className="moving-border-beam"
        style={{ borderRadius }}
      />
      <div
        className={`relative z-10 h-full ${className}`}
        style={{ borderRadius }}
      >
        {children}
      </div>
    </Component>
  );
}
