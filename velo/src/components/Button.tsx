'use client';

import styles from './Button.module.css';

type ButtonVariant = 'number' | 'operator' | 'special' | 'equals' | 'zero';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  wide?: boolean;
}

export default function Button({
  label,
  onClick,
  variant = 'number',
  wide = false,
}: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${wide ? styles.wide : ''}`}
      onClick={onClick}
      aria-label={label}
    >
      {label}
    </button>
  );
}
