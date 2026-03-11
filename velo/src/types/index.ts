export interface CalculationRecord {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
