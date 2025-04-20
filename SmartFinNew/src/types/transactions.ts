import { MaterialCommunityIcons } from '@expo/vector-icons';

export type TransactionType = 'income' | 'expense';
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: Date;
  type: TransactionType;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export interface FixedTransaction extends Omit<Transaction, 'date'> {
  date: number; // Dia do mês
  frequency: Frequency;
} 