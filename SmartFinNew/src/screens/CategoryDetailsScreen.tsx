import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, ProgressBar, List, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { formatCurrency } from '../utils/formatters';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

interface CategoryDetailsScreenProps {
  route: {
    params: {
      category: string;
      limit: number;
      spent: number;
      transactions: Transaction[];
    };
  };
}

const CategoryDetailsScreen: React.FC<CategoryDetailsScreenProps> = ({ route }) => {
  const { category, limit, spent, transactions } = route.params;
  const theme = useTheme();
  const percentage = spent / limit;

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.card} elevation={2}>
        <Text style={styles.title}>{category}</Text>
        <View style={styles.limitContainer}>
          <Text style={styles.subtitle}>Limite mensal:</Text>
          <Text style={styles.amount}>{formatCurrency(limit)}</Text>
        </View>
        <View style={styles.spentContainer}>
          <Text style={styles.subtitle}>Gasto atual:</Text>
          <Text style={[styles.amount, { color: percentage > 0.8 ? COLORS.error : COLORS.success }]}>
            {formatCurrency(spent)}
          </Text>
        </View>
        <ProgressBar
          progress={percentage}
          color={percentage > 0.8 ? COLORS.error : COLORS.success}
          style={styles.progressBar}
        />
        <Text style={styles.percentage}>{Math.round(percentage * 100)}% utilizado</Text>
      </Surface>

      <Surface style={styles.transactionsCard} elevation={2}>
        <Text style={styles.transactionsTitle}>Transações Recentes</Text>
        {transactions.map((transaction) => (
          <List.Item
            key={transaction.id}
            title={transaction.description}
            description={new Date(transaction.date).toLocaleDateString('pt-BR')}
            right={() => (
              <Text style={[styles.transactionAmount, { color: COLORS.error }]}>
                {formatCurrency(transaction.amount)}
              </Text>
            )}
            left={() => (
              <MaterialCommunityIcons
                name="cash-minus"
                size={24}
                color={COLORS.error}
                style={styles.icon}
              />
            )}
          />
        ))}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  limitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  spentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  percentage: {
    textAlign: 'right',
    color: '#666',
    fontSize: 14,
  },
  transactionsCard: {
    padding: 16,
    borderRadius: 12,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
  },
  icon: {
    alignSelf: 'center',
    marginRight: 8,
  },
});

export default CategoryDetailsScreen; 