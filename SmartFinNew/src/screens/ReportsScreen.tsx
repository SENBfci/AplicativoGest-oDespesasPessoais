import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Surface,
  Text,
  useTheme,
  Button,
  Chip,
  IconButton,
  SegmentedButtons,
  ProgressBar,
  Divider,
  Menu,
} from 'react-native-paper';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

type Trend = 'up' | 'down' | 'stable';
type InsightType = 'warning' | 'success' | 'info';
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface Expense {
  category: string;
  amount: number;
  color: string;
  trend: Trend;
  percentage: number;
}

interface Insight {
  type: InsightType;
  message: string;
  icon: MaterialIconName;
}

// Dados mockados para exemplo
const mockData = {
  summary: {
    income: 5000.00,
    expenses: 3000.00,
    balance: 2000.00,
    savingsGoal: 1000.00,
    currentSavings: 800.00,
  },
  expenses: [
    { category: 'Alimentação', amount: 850.00, color: '#FF6B6B', trend: 'up' as Trend, percentage: 28.33 },
    { category: 'Transporte', amount: 450.00, color: '#4ECDC4', trend: 'down' as Trend, percentage: 15 },
    { category: 'Moradia', amount: 1200.00, color: '#45B7D1', trend: 'stable' as Trend, percentage: 40 },
    { category: 'Lazer', amount: 300.00, color: '#96CEB4', trend: 'up' as Trend, percentage: 10 },
    { category: 'Outros', amount: 200.00, color: '#FFEEAD', trend: 'down' as Trend, percentage: 6.67 },
  ] as Expense[],
  monthlyData: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        data: [2500, 3000, 2800, 3200, 2900, 3000],
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
      },
    ],
  },
  comparisons: {
    previousPeriod: -5.2,
    average: 8.3,
  },
  recurrentExpenses: [
    { description: 'Netflix', amount: 39.90, dueDay: 15 },
    { description: 'Academia', amount: 89.90, dueDay: 10 },
    { description: 'Aluguel', amount: 1200.00, dueDay: 5 },
  ],
  insights: [
    { type: 'warning' as InsightType, message: 'Gastos com alimentação aumentaram 15% este mês', icon: 'food' as MaterialIconName },
    { type: 'success' as InsightType, message: 'Economia de 20% em transporte', icon: 'car' as MaterialIconName },
    { type: 'info' as InsightType, message: 'Meta de economia próxima de ser atingida', icon: 'piggy-bank' as MaterialIconName },
  ] as Insight[],
};

type Period = 'week' | 'month' | 'year';
type ChartType = 'line' | 'pie' | 'bar';

export default function ReportsScreen() {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [selectedChart, setSelectedChart] = useState<ChartType>('pie');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const totalExpenses = mockData.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const savingsProgress = mockData.summary.currentSavings / mockData.summary.savingsGoal;

  const pieChartData = mockData.expenses.map(item => ({
    name: item.category,
    amount: item.amount,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  const getTrendIcon = (trend: Trend) => {
    switch (trend) {
      case 'up':
        return { name: 'trending-up' as const, color: '#FF6B6B' };
      case 'down':
        return { name: 'trending-down' as const, color: '#4ECDC4' };
      default:
        return { name: 'trending-neutral' as const, color: '#7F7F7F' };
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning':
        return '#FFA726';
      case 'success':
        return '#66BB6A';
      case 'info':
        return '#42A5F5';
      default:
        return '#7F7F7F';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho com Período e Exportação */}
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerTop}>
          <Text variant="headlineMedium" style={styles.title}>
            Relatórios
          </Text>
          <Menu
            visible={showExportMenu}
            onDismiss={() => setShowExportMenu(false)}
            anchor={
              <IconButton
                icon="export-variant"
                size={24}
                onPress={() => setShowExportMenu(true)}
              />
            }
          >
            <Menu.Item onPress={() => {}} title="Exportar PDF" />
            <Menu.Item onPress={() => {}} title="Exportar Excel" />
            <Menu.Item onPress={() => {}} title="Compartilhar" />
          </Menu>
        </View>
        <SegmentedButtons
          value={selectedPeriod}
          onValueChange={value => setSelectedPeriod(value as Period)}
          buttons={[
            { value: 'week', label: 'Semana' },
            { value: 'month', label: 'Mês' },
            { value: 'year', label: 'Ano' },
          ]}
          style={styles.periodSelector}
        />
      </Surface>

      {/* Cards de Resumo */}
      <View style={styles.summaryContainer}>
        <Surface style={[styles.summaryCard, styles.incomeCard]} elevation={2}>
          <MaterialCommunityIcons name="arrow-up-circle" size={24} color={COLORS.transaction.income} />
          <Text style={styles.summaryLabel}>Receitas</Text>
          <Text style={[styles.summaryValue, { color: COLORS.transaction.income }]}>
            R$ {mockData.summary.income.toFixed(2)}
          </Text>
        </Surface>

        <Surface style={[styles.summaryCard, styles.expenseCard]} elevation={2}>
          <MaterialCommunityIcons name="arrow-down-circle" size={24} color={COLORS.transaction.expense} />
          <Text style={styles.summaryLabel}>Despesas</Text>
          <Text style={[styles.summaryValue, { color: COLORS.transaction.expense }]}>
            R$ {mockData.summary.expenses.toFixed(2)}
          </Text>
        </Surface>

        <Surface style={[styles.summaryCard, styles.balanceCard]} elevation={2}>
          <MaterialCommunityIcons name="wallet" size={24} color={theme.colors.primary} />
          <Text style={styles.summaryLabel}>Saldo</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
            R$ {mockData.summary.balance.toFixed(2)}
          </Text>
        </Surface>
      </View>

      {/* Meta de Economia */}
      <Surface style={styles.savingsCard} elevation={2}>
        <View style={styles.savingsHeader}>
          <View style={styles.savingsTitle}>
            <MaterialCommunityIcons name="piggy-bank" size={24} color={theme.colors.primary} />
            <Text variant="titleMedium" style={styles.savingsTitleText}>
              Meta de Economia
            </Text>
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
            {(savingsProgress * 100).toFixed(0)}%
          </Text>
        </View>
        <ProgressBar
          progress={savingsProgress}
          color={theme.colors.primary}
          style={styles.savingsProgress}
        />
        <Text style={styles.savingsDetail}>
          R$ {mockData.summary.currentSavings.toFixed(2)} de R$ {mockData.summary.savingsGoal.toFixed(2)}
        </Text>
      </Surface>

      {/* Gráficos */}
      <Surface style={styles.chartContainer} elevation={2}>
        <View style={styles.chartHeader}>
          <Text variant="titleMedium">Visão Geral</Text>
          <View style={styles.chartToggle}>
            <IconButton
              icon="chart-pie"
              mode={selectedChart === 'pie' ? 'contained' : 'outlined'}
              onPress={() => setSelectedChart('pie')}
            />
            <IconButton
              icon="chart-line"
              mode={selectedChart === 'line' ? 'contained' : 'outlined'}
              onPress={() => setSelectedChart('line')}
            />
            <IconButton
              icon="chart-bar"
              mode={selectedChart === 'bar' ? 'contained' : 'outlined'}
              onPress={() => setSelectedChart('bar')}
            />
          </View>
        </View>

        {selectedChart === 'pie' && (
          <PieChart
            data={pieChartData}
            width={Dimensions.get('window').width - 48}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )}

        {selectedChart === 'line' && (
          <LineChart
            data={mockData.monthlyData}
            width={Dimensions.get('window').width - 48}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.primary,
              backgroundGradientFrom: theme.colors.primary,
              backgroundGradientTo: theme.colors.primary,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.lineChart}
          />
        )}

        {selectedChart === 'bar' && (
          <BarChart
            data={mockData.monthlyData}
            width={Dimensions.get('window').width - 48}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: theme.colors.primary,
              backgroundGradientFrom: theme.colors.primary,
              backgroundGradientTo: theme.colors.primary,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={styles.barChart}
          />
        )}

        <View style={styles.comparisons}>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Comparado ao período anterior</Text>
            <Text style={[
              styles.comparisonValue,
              { color: mockData.comparisons.previousPeriod >= 0 ? COLORS.transaction.income : COLORS.transaction.expense }
            ]}>
              {mockData.comparisons.previousPeriod}%
            </Text>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Comparado à média</Text>
            <Text style={[
              styles.comparisonValue,
              { color: mockData.comparisons.average >= 0 ? COLORS.transaction.income : COLORS.transaction.expense }
            ]}>
              {mockData.comparisons.average}%
            </Text>
          </View>
        </View>
      </Surface>

      {/* Insights */}
      <Surface style={styles.insightsContainer} elevation={2}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Insights
        </Text>
        {mockData.insights.map((insight, index) => (
          <View key={index} style={styles.insightItem}>
            <MaterialCommunityIcons
              name={insight.icon}
              size={24}
              color={getInsightColor(insight.type)}
            />
            <Text style={styles.insightText}>{insight.message}</Text>
          </View>
        ))}
      </Surface>

      {/* Despesas por Categoria */}
      <Surface style={styles.categoriesContainer} elevation={2}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Despesas por Categoria
        </Text>
        {mockData.expenses.map((expense, index) => (
          <View key={index}>
            <View style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryDot, { backgroundColor: expense.color }]} />
                <View>
                  <Text variant="bodyLarge">{expense.category}</Text>
                  <Text variant="bodySmall" style={styles.categoryPercentage}>
                    {expense.percentage}% do total
                  </Text>
                </View>
              </View>
              <View style={styles.categoryDetails}>
                <MaterialCommunityIcons
                  name={getTrendIcon(expense.trend).name}
                  size={20}
                  color={getTrendIcon(expense.trend).color}
                  style={styles.trendIcon}
                />
                <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
                  R$ {expense.amount.toFixed(2)}
                </Text>
              </View>
            </View>
            {index < mockData.expenses.length - 1 && <Divider />}
          </View>
        ))}
      </Surface>

      {/* Despesas Recorrentes */}
      <Surface style={styles.recurrentContainer} elevation={2}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Despesas Recorrentes
        </Text>
        {mockData.recurrentExpenses.map((expense, index) => (
          <View key={index}>
            <View style={styles.recurrentItem}>
              <View>
                <Text variant="bodyLarge">{expense.description}</Text>
                <Text variant="bodySmall" style={styles.dueDay}>
                  Vencimento: dia {expense.dueDay}
                </Text>
              </View>
              <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
                R$ {expense.amount.toFixed(2)}
              </Text>
            </View>
            {index < mockData.recurrentExpenses.length - 1 && <Divider />}
          </View>
        ))}
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
  },
  periodSelector: {
    marginBottom: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  savingsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  savingsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savingsTitleText: {
    marginLeft: 8,
  },
  savingsProgress: {
    height: 8,
    borderRadius: 4,
  },
  savingsDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartToggle: {
    flexDirection: 'row',
  },
  lineChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  barChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  comparisons: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  insightsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
  },
  categoriesContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryPercentage: {
    color: '#666',
  },
  categoryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendIcon: {
    marginRight: 4,
  },
  recurrentContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  recurrentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dueDay: {
    color: '#666',
    marginTop: 4,
  },
  incomeCard: {
    backgroundColor: '#fff',
  },
  expenseCard: {
    backgroundColor: '#fff',
  },
  balanceCard: {
    backgroundColor: '#fff',
  },
}); 