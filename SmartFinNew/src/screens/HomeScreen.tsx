import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Surface,
  Text,
  useTheme,
  Button,
  Avatar,
  Divider,
  ProgressBar,
  IconButton,
  Card,
  Chip,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TransactionType, Frequency, FixedTransaction } from '../types/transactions';
import { COLORS } from '../theme/colors';
import { LineChart } from 'react-native-chart-kit';

// Tipos para os ícones e dados
type TransactionIconName = 'food' | 'cash-plus' | 'movie' | 'car' | 'shopping' | 'home';
type AlertType = 'warning' | 'success' | 'info';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  icon: TransactionIconName;
}

interface Alert {
  type: AlertType;
  message: string;
  action?: string;
}

interface BillToPay {
  description: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

// Dados mockados aprimorados
const mockData = {
  user: {
    name: 'João Silva',
    photo: 'https://i.pravatar.cc/150?img=8',
  },
  balance: 3500.00,
  income: 5000.00,
  expenses: 1500.00,
  monthlyTrend: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{
      data: [2000, 2500, 2300, 3000, 2800, 3500],
    }],
  },
  recentTransactions: [
    { id: 1, description: 'Supermercado Extra', amount: -156.75, category: 'Alimentação', date: '2024-03-15', icon: 'food' },
    { id: 2, description: 'Salário', amount: 5000.00, category: 'Receita', date: '2024-03-10', icon: 'cash-plus' },
    { id: 3, description: 'Netflix', amount: -39.90, category: 'Lazer', date: '2024-03-08', icon: 'movie' },
    { id: 4, description: 'Uber', amount: -25.50, category: 'Transporte', date: '2024-03-07', icon: 'car' },
  ] as Transaction[],
  goals: [
    { name: 'Alimentação', current: 850, limit: 1000, color: COLORS.categories.food },
    { name: 'Transporte', current: 450, limit: 500, color: COLORS.categories.transport },
    { name: 'Lazer', current: 300, limit: 400, color: COLORS.categories.entertainment },
  ],
  alerts: [
    { type: 'warning', message: 'Gastos com alimentação próximos do limite', action: 'Ver detalhes' },
    { type: 'success', message: 'Meta de economia atingida este mês!', action: 'Ver metas' },
    { type: 'info', message: 'Novo relatório mensal disponível', action: 'Ver relatório' },
  ] as Alert[],
  upcomingBills: [
    { description: 'Aluguel', amount: 1200.00, dueDate: '2024-03-20', isPaid: false },
    { description: 'Energia', amount: 150.00, dueDate: '2024-03-22', isPaid: false },
    { description: 'Internet', amount: 99.90, dueDate: '2024-03-25', isPaid: false },
  ] as BillToPay[],
  insights: {
    monthlyComparison: '+12%',
    biggestExpense: 'Alimentação',
    savedAmount: 500.00,
  },
};

export default function HomeScreen({ navigation }: any) {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const formatCurrency = (value: number) => {
    return `R$ ${Math.abs(value).toFixed(2)}`;
  };

  const getTransactionColor = (amount: number) => {
    return amount >= 0 ? COLORS.transaction.income : COLORS.transaction.expense;
  };

  const getAlertIcon = (type: AlertType): string => {
    switch (type) {
      case 'warning': return 'alert-circle';
      case 'success': return 'check-circle';
      case 'info': return 'information';
      default: return 'information';
    }
  };

  const getAlertColor = (type: AlertType): string => {
    switch (type) {
      case 'warning': return '#FFA726';
      case 'success': return '#66BB6A';
      case 'info': return '#42A5F5';
      default: return '#757575';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      width: '100%',
    },
    userHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      marginRight: 12,
      backgroundColor: theme.colors.primaryContainer,
    },
    userTextContainer: {
      flex: 1,
    },
    greeting: {
      fontSize: 14,
      color: theme.colors.onSurface,
      opacity: 0.7,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    balanceCard: {
      margin: 16,
      padding: 24,
      borderRadius: 16,
      backgroundColor: COLORS.surface,
    },
    balanceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    periodSelector: {
      flexDirection: 'row',
      gap: 8,
    },
    periodChip: {
      height: 32,
    },
    balanceTitle: {
      fontSize: 16,
      color: COLORS.text.secondary,
    },
    balanceAmount: {
      fontSize: 32,
      fontWeight: 'bold',
      color: COLORS.text.primary,
      marginBottom: 24,
    },
    balanceDetails: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 24,
    },
    balanceItem: {
      alignItems: 'center',
    },
    balanceLabel: {
      fontSize: 14,
      color: COLORS.text.secondary,
      marginTop: 4,
    },
    balanceValue: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 4,
    },
    chart: {
      marginTop: 16,
      borderRadius: 16,
    },
    insightsCard: {
      margin: 16,
      padding: 16,
      borderRadius: 16,
      backgroundColor: COLORS.surface,
    },
    insightsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    insightItem: {
      flex: 1,
      alignItems: 'center',
      padding: 8,
    },
    insightLabel: {
      fontSize: 12,
      color: COLORS.text.secondary,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 4,
    },
    insightValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: COLORS.text.primary,
    },
    actionsCard: {
      margin: 16,
      padding: 16,
      borderRadius: 16,
      backgroundColor: COLORS.surface,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      alignItems: 'center',
      flex: 1,
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    actionText: {
      fontSize: 12,
      color: COLORS.text.secondary,
      textAlign: 'center',
    },
    alertsCard: {
      margin: 16,
      padding: 16,
      borderRadius: 16,
      backgroundColor: COLORS.surface,
    },
    alertItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
    },
    alertContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    alertMessage: {
      marginLeft: 12,
      flex: 1,
      fontSize: 14,
      color: COLORS.text.primary,
    },
    billsCard: {
      margin: 16,
      padding: 16,
      borderRadius: 16,
      backgroundColor: COLORS.surface,
    },
    billsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    billItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      paddingVertical: 4,
    },
    billInfo: {
      flex: 1,
      marginRight: 16,
    },
    billDescription: {
      fontSize: 14,
      color: COLORS.text.primary,
      fontWeight: '500',
    },
    billDate: {
      fontSize: 12,
      color: COLORS.text.secondary,
      marginTop: 2,
    },
    billAmount: {
      alignItems: 'flex-end',
      minWidth: 100,
    },
    billValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: COLORS.text.primary,
      marginBottom: 4,
    },
    billStatus: {
      height: 24,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    billStatusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.text.primary,
    },
    transactionsCard: {
      margin: 16,
      padding: 16,
      borderRadius: 16,
      backgroundColor: COLORS.surface,
    },
    transactionsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
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
      fontSize: 14,
      color: COLORS.text.primary,
    },
    transactionDate: {
      fontSize: 12,
      color: COLORS.text.secondary,
      marginTop: 4,
    },
    transactionAmount: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    divider: {
      marginVertical: 8,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.userHeader}>
            {mockData.user.photo ? (
              <Avatar.Image
                size={40}
                source={{ uri: mockData.user.photo }}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Text
                size={40}
                label={mockData.user.name.substring(0, 2).toUpperCase()}
                style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
              />
            )}
            <View style={styles.userTextContainer}>
              <Text style={styles.greeting}>Olá,</Text>
              <Text style={styles.userName}>{mockData.user.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Surface>

      {/* Card de Saldo com Gráfico */}
      <Surface style={styles.balanceCard} elevation={2}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceTitle}>Saldo Disponível</Text>
          <View style={styles.periodSelector}>
            <Chip
              selected={selectedPeriod === 'month'}
              onPress={() => setSelectedPeriod('month')}
              style={styles.periodChip}
            >
              Mês
            </Chip>
            <Chip
              selected={selectedPeriod === 'year'}
              onPress={() => setSelectedPeriod('year')}
              style={styles.periodChip}
            >
              Ano
            </Chip>
          </View>
        </View>
        <Text style={styles.balanceAmount}>{formatCurrency(mockData.balance)}</Text>
        <View style={styles.balanceDetails}>
          <View style={styles.balanceItem}>
            <MaterialCommunityIcons name="arrow-up-circle" size={24} color={COLORS.transaction.income} />
            <Text style={styles.balanceLabel}>Receitas</Text>
            <Text style={[styles.balanceValue, { color: COLORS.transaction.income }]}>
              {formatCurrency(mockData.income)}
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <MaterialCommunityIcons name="arrow-down-circle" size={24} color={COLORS.transaction.expense} />
            <Text style={styles.balanceLabel}>Despesas</Text>
            <Text style={[styles.balanceValue, { color: COLORS.transaction.expense }]}>
              {formatCurrency(mockData.expenses)}
            </Text>
          </View>
        </View>
        <LineChart
          data={mockData.monthlyTrend}
          width={Dimensions.get('window').width - 64}
          height={180}
          chartConfig={{
            backgroundColor: theme.colors.primary,
            backgroundGradientFrom: theme.colors.primary,
            backgroundGradientTo: theme.colors.primary,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          bezier
          style={styles.chart}
        />
      </Surface>

      {/* Insights Rápidos */}
      <Surface style={styles.insightsCard} elevation={2}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insightsGrid}>
          <View style={styles.insightItem}>
            <MaterialCommunityIcons name="trending-up" size={24} color={COLORS.transaction.income} />
            <Text style={styles.insightLabel}>Comparado ao mês anterior</Text>
            <Text style={styles.insightValue}>{mockData.insights.monthlyComparison}</Text>
          </View>
          <View style={styles.insightItem}>
            <MaterialCommunityIcons name="shopping" size={24} color={theme.colors.primary} />
            <Text style={styles.insightLabel}>Maior gasto</Text>
            <Text style={styles.insightValue}>{mockData.insights.biggestExpense}</Text>
          </View>
          <View style={styles.insightItem}>
            <MaterialCommunityIcons name="piggy-bank" size={24} color={COLORS.transaction.income} />
            <Text style={styles.insightLabel}>Economizado</Text>
            <Text style={styles.insightValue}>{formatCurrency(mockData.insights.savedAmount)}</Text>
          </View>
        </View>
      </Surface>

      {/* Ações Rápidas */}
      <Surface style={styles.actionsCard} elevation={2}>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Transaction', { type: 'expense' })}
          >
            <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryLight }]}>
              <MaterialCommunityIcons name="plus" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Nova Despesa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Transaction', { type: 'income' })}
          >
            <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryLight }]}>
              <MaterialCommunityIcons name="cash-plus" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Nova Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ScanReceipt')}
          >
            <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryLight }]}>
              <MaterialCommunityIcons name="camera" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Escanear</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Reports')}
          >
            <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryLight }]}>
              <MaterialCommunityIcons name="chart-box" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Relatórios</Text>
          </TouchableOpacity>
        </View>
      </Surface>

      {/* Alertas */}
      <Surface style={styles.alertsCard} elevation={2}>
        <Text style={styles.sectionTitle}>Alertas</Text>
        {mockData.alerts.map((alert, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.alertItem}
            onPress={() => {
              switch (alert.type) {
                case 'warning':
                  navigation.navigate('CategoryDetails', { 
                    category: 'Alimentação',
                    limit: 1000,
                    spent: 850,
                    transactions: mockData.recentTransactions.filter(t => t.category === 'Alimentação')
                  });
                  break;
                case 'success':
                  navigation.navigate('Goals', { 
                    highlightCompleted: true,
                    goals: mockData.goals
                  });
                  break;
                case 'info':
                  navigation.navigate('Reports', { 
                    initialPeriod: 'month'
                  });
                  break;
              }
            }}
          >
            <View style={styles.alertContent}>
              <MaterialCommunityIcons
                name={getAlertIcon(alert.type)}
                size={24}
                color={getAlertColor(alert.type)}
              />
              <Text style={styles.alertMessage}>{alert.message}</Text>
            </View>
            <Button 
              mode="text" 
              textColor={COLORS.primary}
              onPress={() => {
                switch (alert.type) {
                  case 'warning':
                    navigation.navigate('CategoryDetails', { 
                      category: 'Alimentação',
                      limit: 1000,
                      spent: 850,
                      transactions: mockData.recentTransactions.filter(t => t.category === 'Alimentação')
                    });
                    break;
                  case 'success':
                    navigation.navigate('Goals', { 
                      highlightCompleted: true,
                      goals: mockData.goals
                    });
                    break;
                  case 'info':
                    navigation.navigate('Reports', { 
                      initialPeriod: 'month'
                    });
                    break;
                }
              }}
            >
              {alert.action}
            </Button>
          </TouchableOpacity>
        ))}
      </Surface>

      {/* Contas a Pagar */}
      <Surface style={styles.billsCard} elevation={2}>
        <View style={styles.billsHeader}>
          <Text style={styles.sectionTitle}>Próximas Contas</Text>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('FixedTransactions')}
          >
            Ver todas
          </Button>
        </View>
        {mockData.upcomingBills.map((bill, index) => (
          <View key={index} style={styles.billItem}>
            <View style={styles.billInfo}>
              <Text style={styles.billDescription}>{bill.description}</Text>
              <Text style={styles.billDate}>Vence em {bill.dueDate}</Text>
            </View>
            <View style={styles.billAmount}>
              <Text style={styles.billValue}>{formatCurrency(bill.amount)}</Text>
              <View
                style={[
                  styles.billStatus,
                  { 
                    borderColor: bill.isPaid ? COLORS.transaction.income : COLORS.transaction.expense,
                    backgroundColor: bill.isPaid ? COLORS.transaction.income + '20' : COLORS.transaction.expense + '20',
                  }
                ]}
              >
                <Text
                  style={[
                    styles.billStatusText,
                    { color: bill.isPaid ? COLORS.transaction.income : COLORS.transaction.expense }
                  ]}
                >
                  {bill.isPaid ? 'Pago' : 'Pendente'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Surface>

      {/* Últimas Transações */}
      <Surface style={styles.transactionsCard} elevation={2}>
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Últimas Transações</Text>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Transactions')}
          >
            Ver todas
          </Button>
        </View>
        {mockData.recentTransactions.map((transaction, index) => (
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
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: getTransactionColor(transaction.amount) }]}>
                {formatCurrency(transaction.amount)}
              </Text>
            </TouchableOpacity>
            {index < mockData.recentTransactions.length - 1 && <Divider style={styles.divider} />}
          </React.Fragment>
        ))}
      </Surface>
    </ScrollView>
  );
} 