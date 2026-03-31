'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface CosmicButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
}

const RANDOM = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export default function CosmicButton({ href, children, variant = 'primary', className = '' }: CosmicButtonProps) {
  const galaxyRef = useRef<HTMLSpanElement>(null);
  const staticRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const setStarStyles = (el: HTMLElement) => {
      el.style.setProperty('--angle', `${RANDOM(0, 360)}`);
      el.style.setProperty('--duration', `${RANDOM(6, 20)}`);
      el.style.setProperty('--delay', `${RANDOM(1, 10)}`);
      el.style.setProperty('--alpha', `${RANDOM(40, 90) / 100}`);
      el.style.setProperty('--size', `${RANDOM(2, 6)}`);
      el.style.setProperty('--distance', `${RANDOM(40, 200)}`);
    };

    galaxyRef.current?.querySelectorAll<HTMLElement>('.cosmic-star').forEach(setStarStyles);
    staticRef.current?.querySelectorAll<HTMLElement>('.cosmic-star').forEach(setStarStyles);
  }, []);

  const isPrimary = variant === 'primary';

  return (
    <Link
      href={href}
      className={`cosmic-btn ${isPrimary ? 'cosmic-btn--primary' : 'cosmic-btn--outline'} ${className}`}
    >
      <span className="cosmic-spark" />
      <span className="cosmic-spark cosmic-spark--2" />
      <span className="cosmic-backdrop" />
      <span ref={staticRef} className="cosmic-galaxy-container">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={`s${i}`} className="cosmic-star cosmic-star--static" />
        ))}
      </span>
      <span className="cosmic-galaxy">
        <span ref={galaxyRef} className="cosmic-galaxy-ring">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={`o${i}`} className="cosmic-star" />
          ))}
        </span>
      </span>
      <span className="cosmic-text">{children}</span>
    </Link>
  );
}
