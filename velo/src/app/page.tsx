import Calculator from '@/components/Calculator';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {process.env.NEXT_PUBLIC_APP_NAME || 'Velo'}
        </h1>
        <p className={styles.subtitle}>Modern Calculator</p>
      </div>
      <Calculator />
    </main>
  );
}
