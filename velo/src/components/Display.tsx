'use client';

import styles from './Display.module.css';

interface DisplayProps {
  expression: string;
  current: string;
  isError?: boolean;
}

export default function Display({ expression, current, isError }: DisplayProps) {
  const displayValue = current || '0';
  const fontSize =
    displayValue.length > 12
      ? '1.4rem'
      : displayValue.length > 9
      ? '1.8rem'
      : displayValue.length > 6
      ? '2.2rem'
      : '2.8rem';

  return (
    <div className={styles.display}>
      <div className={styles.expression}>{expression || '\u00A0'}</div>
      <div
        className={`${styles.current} ${isError ? styles.error : ''}`}
        style={{ fontSize }}
      >
        {displayValue}
      </div>
    </div>
  );
}
