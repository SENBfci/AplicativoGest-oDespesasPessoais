import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Surface,
  Text,
  useTheme,
  Chip,
  Divider,
  IconButton,
  Menu,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

// Tipos
interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  icon: 'food' | 'cash-plus' | 'movie' | 'car' | 'shopping' | 'home' | 'cash';
  type: 'income' | 'expense';
}

// Dados mockados
const mockTransactions: Transaction[] = [
  // Março 2024
  {
    id: 1,
    description: 'Supermercado Extra',
    amount: -456.75,
    category: 'Alimentação',
    date: '2024-03-15',
    icon: 'food',
    type: 'expense',
  },
  {
    id: 2,
    description: 'Salário',
    amount: 5000.00,
    category: 'Receita Fixa',
    date: '2024-03-10',
    icon: 'cash-plus',
    type: 'income',
  },
  {
    id: 3,
    description: 'Netflix',
    amount: -55.90,
    category: 'Entretenimento',
    date: '2024-03-08',
    icon: 'movie',
    type: 'expense',
  },
  {
    id: 4,
    description: 'Uber',
    amount: -32.50,
    category: 'Transporte',
    date: '2024-03-07',
    icon: 'car',
    type: 'expense',
  },
  {
    id: 5,
    description: 'Freelance Design',
    amount: 1200.00,
    category: 'Receita Extra',
    date: '2024-03-05',
    icon: 'cash',
    type: 'income',
  },
  {
    id: 6,
    description: 'Academia',
    amount: -89.90,
    category: 'Saúde',
    date: '2024-03-04',
    icon: 'home',
    type: 'expense',
  },
  {
    id: 7,
    description: 'Conta de Luz',
    amount: -245.30,
    category: 'Moradia',
    date: '2024-03-03',
    icon: 'home',
    type: 'expense',
  },
  {
    id: 8,
    description: 'Internet',
    amount: -119.90,
    category: 'Moradia',
    date: '2024-03-02',
    icon: 'home',
    type: 'expense',
  },
  {
    id: 9,
    description: 'Venda Item Usado',
    amount: 350.00,
    category: 'Receita Extra',
    date: '2024-03-01',
    icon: 'cash',
    type: 'income',
  },
  // Fevereiro 2024
  {
    id: 10,
    description: 'Farmácia',
    amount: -76.45,
    category: 'Saúde',
    date: '2024-02-28',
    icon: 'home',
    type: 'expense',
  },
  {
    id: 11,
    description: 'Salário',
    amount: 5000.00,
    category: 'Receita Fixa',
    date: '2024-02-25',
    icon: 'cash-plus',
    type: 'income',
  },
  {
    id: 12,
    description: 'Restaurante',
    amount: -89.90,
    category: 'Alimentação',
    date: '2024-02-20',
    icon: 'food',
    type: 'expense',
  },
  {
    id: 13,
    description: 'Presente Aniversário',
    amount: -150.00,
    category: 'Outros',
    date: '2024-02-15',
    icon: 'shopping',
    type: 'expense',
  },
  {
    id: 14,
    description: 'Conta de Água',
    amount: -98.75,
    category: 'Moradia',
    date: '2024-02-10',
    icon: 'home',
    type: 'expense',
  },
  {
    id: 15,
    description: 'Bônus',
    amount: 1000.00,
    category: 'Receita Extra',
    date: '2024-02-05',
    icon: 'cash',
    type: 'income',
  },
  // Janeiro 2024
  {
    id: 16,
    description: 'Salário',
    amount: 5000.00,
    category: 'Receita Fixa',
    date: '2024-01-25',
    icon: 'cash-plus',
    type: 'income',
  },
  {
    id: 17,
    description: 'Material Escritório',
    amount: -125.30,
    category: 'Outros',
    date: '2024-01-20',
    icon: 'shopping',
    type: 'expense',
  },
  {
    id: 18,
    description: 'Manutenção Carro',
    amount: -450.00,
    category: 'Transporte',
    date: '2024-01-15',
    icon: 'car',
    type: 'expense',
  },
  {
    id: 19,
    description: 'Consultoria',
    amount: 800.00,
    category: 'Receita Extra',
    date: '2024-01-10',
    icon: 'cash',
    type: 'income',
  },
  {
    id: 20,
    description: 'Supermercado',
    amount: -385.45,
    category: 'Alimentação',
    date: '2024-01-05',
    icon: 'food',
    type: 'expense',
  },
];

export default function TransactionsScreen({ navigation }: any) {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const formatCurrency = (value: number) => {
    return `R$ ${Math.abs(value).toFixed(2)}`;
  };

  const getTransactionColor = (amount: number) => {
    return amount >= 0 ? COLORS.transaction.income : COLORS.transaction.expense;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const filterTransactions = () => {
    let filtered = [...mockTransactions];
    
    // Filtro por tipo
    if (selectedFilter === 'income') {
      filtered = filtered.filter(t => t.type === 'income');
    } else if (selectedFilter === 'expense') {
      filtered = filtered.filter(t => t.type === 'expense');
    }

    // Filtro por período
    const today = new Date();
    const filterDate = new Date();

    // Ajusta as horas para considerar o dia inteiro
    today.setHours(23, 59, 59, 999);
    filterDate.setHours(0, 0, 0, 0);
    
    switch (selectedPeriod) {
      case 'week':
        filterDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        filterDate.setDate(1); // Primeiro dia do mês atual
        break;
      case 'year':
        filterDate.setMonth(0, 1); // 1º de Janeiro do ano atual
        break;
    }

    console.log('Filter Date:', filterDate);
    console.log('Today:', today);

    filtered = filtered.filter(t => {
      const transactionDate = new Date(t.date);
      console.log('Transaction Date:', transactionDate, t.description);
      return transactionDate >= filterDate && transactionDate <= today;
    });

    console.log('Filtered Transactions:', filtered.length);

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const calculateTotal = (type: 'income' | 'expense' | 'balance') => {
    const transactions = filterTransactions();
    if (type === 'income') {
      return transactions.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc, 0);
    } else if (type === 'expense') {
      return transactions.reduce((acc, curr) => curr.type === 'expense' ? acc + Math.abs(curr.amount) : acc, 0);
    } else {
      return transactions.reduce((acc, curr) => {
        return acc + (curr.type === 'income' ? curr.amount : -Math.abs(curr.amount));
      }, 0);
    }
  };

  // Atualiza as datas dos dados mockados para serem relativas à data atual
  const updateMockDates = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    mockTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      date.setFullYear(currentYear);
      date.setMonth(currentMonth);
      transaction.date = date.toISOString().split('T')[0];
    });
  };

  // Chama a função para atualizar as datas quando o componente é montado
  useEffect(() => {
    updateMockDates();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Cabeçalho com Filtros */}
      <Surface style={[styles.header, { backgroundColor: COLORS.primary }]} elevation={2}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: 'white' }]}>Transações</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="filter-variant"
                size={24}
                iconColor="white"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item 
              onPress={() => {
                setSelectedFilter('all');
                setMenuVisible(false);
              }} 
              title="Todas"
            />
            <Menu.Item 
              onPress={() => {
                setSelectedFilter('income');
                setMenuVisible(false);
              }} 
              title="Receitas"
            />
            <Menu.Item 
              onPress={() => {
                setSelectedFilter('expense');
                setMenuVisible(false);
              }} 
              title="Despesas"
            />
          </Menu>
        </View>
        
        <View style={styles.periodSelector}>
          <Chip
            selected={selectedPeriod === 'week'}
            onPress={() => setSelectedPeriod('week')}
            style={[
              styles.chip,
              selectedPeriod === 'week' && styles.selectedChip
            ]}
            textStyle={{ 
              color: selectedPeriod === 'week' ? 'white' : COLORS.text.primary,
              fontWeight: selectedPeriod === 'week' ? 'bold' : 'normal'
            }}
          >
            Semana
          </Chip>
          <Chip
            selected={selectedPeriod === 'month'}
            onPress={() => setSelectedPeriod('month')}
            style={[
              styles.chip,
              selectedPeriod === 'month' && styles.selectedChip
            ]}
            textStyle={{ 
              color: selectedPeriod === 'month' ? 'white' : COLORS.text.primary,
              fontWeight: selectedPeriod === 'month' ? 'bold' : 'normal'
            }}
          >
            Mês
          </Chip>
          <Chip
            selected={selectedPeriod === 'year'}
            onPress={() => setSelectedPeriod('year')}
            style={[
              styles.chip,
              selectedPeriod === 'year' && styles.selectedChip
            ]}
            textStyle={{ 
              color: selectedPeriod === 'year' ? 'white' : COLORS.text.primary,
              fontWeight: selectedPeriod === 'year' ? 'bold' : 'normal'
            }}
          >
            Ano
          </Chip>
        </View>
      </Surface>

      {/* Resumo do Período */}
      <Surface style={[styles.summaryCard, { backgroundColor: COLORS.surface }]} elevation={2}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: COLORS.text.secondary }]}>Receitas</Text>
            <Text style={[styles.summaryValue, { color: COLORS.transaction.income }]}>
              {formatCurrency(calculateTotal('income'))}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: COLORS.text.secondary }]}>Despesas</Text>
            <Text style={[styles.summaryValue, { color: COLORS.transaction.expense }]}>
              {formatCurrency(calculateTotal('expense'))}
            </Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.balanceRow}>
          <Text style={[styles.balanceLabel, { color: COLORS.text.primary }]}>Saldo do Período</Text>
          <Text style={[styles.balanceValue, { 
            color: calculateTotal('balance') >= 0 ? COLORS.transaction.income : COLORS.transaction.expense 
          }]}>
            {formatCurrency(Math.abs(calculateTotal('balance')))}
          </Text>
        </View>
      </Surface>

      {/* Lista de Transações */}
      <ScrollView style={styles.transactionsList}>
        {filterTransactions().length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhuma transação encontrada</Text>
          </View>
        ) : (
          filterTransactions().map((transaction, index) => (
            <React.Fragment key={transaction.id}>
              <TouchableOpacity 
                style={styles.transaction}
                onPress={() => navigation.navigate('TransactionDetail', { id: transaction.id })}
              >
                <View style={[styles.transactionIcon, { backgroundColor: COLORS.primaryLight }]}>
                  <MaterialCommunityIcons 
                    name={transaction.icon}
                    size={24} 
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionDescription, { color: COLORS.text.primary }]}>
                    {transaction.description}
                  </Text>
                  <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionCategory, { color: COLORS.text.secondary }]}>
                      {transaction.category}
                    </Text>
                    <Text style={[styles.transactionDate, { color: COLORS.text.secondary }]}>
                      {formatDate(transaction.date)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.transactionAmount, { 
                  color: transaction.type === 'income' ? COLORS.transaction.income : COLORS.transaction.expense 
                }]}>
                  {formatCurrency(Math.abs(transaction.amount))}
                </Text>
              </TouchableOpacity>
              {index < filterTransactions().length - 1 && <Divider style={styles.divider} />}
            </React.Fragment>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    backgroundColor: 'white',
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
  },
  summaryCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionDescription: {
    fontSize: 16,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionCategory: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginRight: 8,
  },
  transactionDate: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  divider: {
    marginVertical: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
}); 