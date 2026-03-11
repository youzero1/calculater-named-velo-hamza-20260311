'use client';

import { useState, useEffect, useCallback } from 'react';
import Display from './Display';
import Button from './Button';
import styles from './Calculator.module.css';
import type { CalculationRecord } from '@/types';

type Operator = '+' | '-' | '×' | '÷' | null;

interface CalcState {
  current: string;
  previous: string;
  operator: Operator;
  shouldResetCurrent: boolean;
  expression: string;
  isError: boolean;
}

const initialState: CalcState = {
  current: '',
  previous: '',
  operator: null,
  shouldResetCurrent: false,
  expression: '',
  isError: false,
};

export default function Calculator() {
  const [state, setState] = useState<CalcState>(initialState);
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/calculations');
      const json = await res.json();
      if (json.data) setHistory(json.data);
    } catch (e) {
      console.error('Failed to fetch history', e);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const saveCalculation = async (expression: string, result: string) => {
    try {
      await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, result }),
      });
      fetchHistory();
    } catch (e) {
      console.error('Failed to save calculation', e);
    }
  };

  const inputDigit = (digit: string) => {
    setState((prev) => {
      if (prev.isError) return { ...initialState, current: digit };
      if (prev.shouldResetCurrent) {
        return { ...prev, current: digit, shouldResetCurrent: false };
      }
      if (prev.current.length >= 15) return prev;
      const newCurrent =
        prev.current === '0' ? digit : prev.current + digit;
      return { ...prev, current: newCurrent };
    });
  };

  const inputDecimal = () => {
    setState((prev) => {
      if (prev.isError) return { ...initialState, current: '0.' };
      if (prev.shouldResetCurrent) {
        return { ...prev, current: '0.', shouldResetCurrent: false };
      }
      if (prev.current.includes('.')) return prev;
      const newCurrent = prev.current === '' ? '0.' : prev.current + '.';
      return { ...prev, current: newCurrent };
    });
  };

  const clear = () => {
    setState(initialState);
  };

  const backspace = () => {
    setState((prev) => {
      if (prev.isError) return initialState;
      if (prev.shouldResetCurrent) return prev;
      const newCurrent = prev.current.slice(0, -1);
      return { ...prev, current: newCurrent };
    });
  };

  const setOperator = (op: Operator) => {
    setState((prev) => {
      if (prev.isError) return initialState;
      const currentVal = prev.current || prev.previous || '0';
      const newExpr = prev.expression
        ? prev.expression
        : currentVal + ' ' + op;

      if (prev.operator && !prev.shouldResetCurrent && prev.current) {
        // Chain operation: calculate first
        const result = calculate(prev.previous, prev.current, prev.operator);
        if (result === null) {
          return {
            ...initialState,
            current: 'Cannot divide by zero',
            isError: true,
          };
        }
        const resultStr = formatResult(result);
        return {
          ...prev,
          previous: resultStr,
          current: resultStr,
          operator: op,
          shouldResetCurrent: true,
          expression: resultStr + ' ' + op,
        };
      }

      return {
        ...prev,
        operator: op,
        previous: currentVal,
        shouldResetCurrent: true,
        expression: currentVal + ' ' + op,
      };
    });
  };

  const calculate = (
    prev: string,
    curr: string,
    op: Operator
  ): number | null => {
    const a = parseFloat(prev);
    const b = parseFloat(curr);
    if (isNaN(a) || isNaN(b)) return parseFloat(prev || curr || '0');
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        if (b === 0) return null;
        return a / b;
      default:
        return b;
    }
  };

  const formatResult = (num: number): string => {
    if (Number.isInteger(num)) return String(num);
    const rounded = parseFloat(num.toFixed(10));
    return String(rounded);
  };

  const equals = () => {
    setState((prev) => {
      if (prev.isError) return initialState;
      if (!prev.operator || !prev.previous) return prev;
      const currVal = prev.current || prev.previous;
      const fullExpr = prev.previous + ' ' + prev.operator + ' ' + currVal + ' =';
      const result = calculate(prev.previous, currVal, prev.operator);

      if (result === null) {
        saveCalculation(fullExpr, 'Error: Division by zero');
        return {
          ...initialState,
          current: 'Cannot divide by zero',
          isError: true,
          expression: fullExpr,
        };
      }

      const resultStr = formatResult(result);
      saveCalculation(fullExpr, resultStr);

      return {
        ...initialState,
        current: resultStr,
        previous: resultStr,
        expression: fullExpr,
      };
    });
  };

  const toggleHistory = () => {
    if (!historyVisible) fetchHistory();
    setHistoryVisible((v) => !v);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.calculatorContainer}>
        {/* Calculator */}
        <div className={styles.calculator}>
          <Display
            expression={state.expression}
            current={state.current}
            isError={state.isError}
          />
          <div className={styles.buttons}>
            {/* Row 1 */}
            <Button label="AC" onClick={clear} variant="special" />
            <Button
              label="⌫"
              onClick={backspace}
              variant="special"
            />
            <Button label="%" onClick={() => {
              setState(prev => {
                if (!prev.current) return prev;
                const val = parseFloat(prev.current) / 100;
                return { ...prev, current: formatResult(val) };
              });
            }} variant="special" />
            <Button label="÷" onClick={() => setOperator('÷')} variant="operator" />

            {/* Row 2 */}
            <Button label="7" onClick={() => inputDigit('7')} />
            <Button label="8" onClick={() => inputDigit('8')} />
            <Button label="9" onClick={() => inputDigit('9')} />
            <Button label="×" onClick={() => setOperator('×')} variant="operator" />

            {/* Row 3 */}
            <Button label="4" onClick={() => inputDigit('4')} />
            <Button label="5" onClick={() => inputDigit('5')} />
            <Button label="6" onClick={() => inputDigit('6')} />
            <Button label="−" onClick={() => setOperator('-')} variant="operator" />

            {/* Row 4 */}
            <Button label="1" onClick={() => inputDigit('1')} />
            <Button label="2" onClick={() => inputDigit('2')} />
            <Button label="3" onClick={() => inputDigit('3')} />
            <Button label="+" onClick={() => setOperator('+')} variant="operator" />

            {/* Row 5 */}
            <Button label="0" onClick={() => inputDigit('0')} variant="zero" />
            <Button label="." onClick={inputDecimal} />
            <Button label="=" onClick={equals} variant="equals" />
          </div>
        </div>

        {/* History Toggle Button */}
        <button
          className={styles.historyToggle}
          onClick={toggleHistory}
          aria-label="Toggle history"
        >
          {historyVisible ? '▼ Hide History' : '▲ Show History'}
        </button>

        {/* History Panel */}
        {historyVisible && (
          <div className={styles.historyPanel}>
            <div className={styles.historyHeader}>
              <span>Calculation History</span>
              {loadingHistory && (
                <span className={styles.loading}>Loading…</span>
              )}
            </div>
            {history.length === 0 ? (
              <div className={styles.emptyHistory}>
                No calculations yet. Start calculating!
              </div>
            ) : (
              <ul className={styles.historyList}>
                {history.map((h) => (
                  <li key={h.id} className={styles.historyItem}>
                    <span className={styles.historyExpr}>{h.expression}</span>
                    <span className={styles.historyResult}>{h.result}</span>
                    <span className={styles.historyDate}>
                      {formatDate(h.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
