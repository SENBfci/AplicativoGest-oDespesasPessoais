export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  description?: string;
  isRecurring?: boolean;
  recurrenceInterval?: 'weekly' | 'monthly' | 'yearly';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  monthlyIncome?: number;
  monthlyBudget?: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category?: string;
  description?: string;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  date: Date;
  isRead: boolean;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
  category?: string;
  description?: string;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export type IconType = 'home' | 'shopping' | 'food' | 'transport' | 'health' | 'education' | 'leisure' | 'other'; 