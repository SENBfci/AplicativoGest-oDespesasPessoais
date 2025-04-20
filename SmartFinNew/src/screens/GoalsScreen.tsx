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
  FAB,
  ProgressBar,
  useTheme,
  IconButton,
  Menu,
  Chip,
  Portal,
  Modal,
  Button,
  TextInput,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';
import { Goal } from '../types';

// Mock data for goals
const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Viagem para Europa',
    targetAmount: 15000,
    currentAmount: 5000,
    deadline: new Date('2024-12-31'),
    category: 'travel',
    description: 'Férias em família pela Europa',
  },
  {
    id: '2',
    title: 'Fundo de Emergência',
    targetAmount: 30000,
    currentAmount: 12000,
    deadline: new Date('2024-06-30'),
    category: 'savings',
    description: '6 meses de despesas',
  },
  {
    id: '3',
    title: 'Novo Notebook',
    targetAmount: 8000,
    currentAmount: 6000,
    deadline: new Date('2024-04-30'),
    category: 'electronics',
    description: 'MacBook Pro para trabalho',
  },
];

const GoalsScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [filter, setFilter] = useState<string>('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const getGoalIcon = (category: string) => {
    switch (category) {
      case 'travel':
        return 'airplane';
      case 'savings':
        return 'piggy-bank';
      case 'electronics':
        return 'laptop';
      case 'car':
        return 'car';
      case 'home':
        return 'home';
      default:
        return 'star';
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const progress = current / target;
    if (progress >= 0.8) return COLORS.success;
    if (progress >= 0.5) return COLORS.info;
    if (progress >= 0.3) return COLORS.warning;
    return COLORS.error;
  };

  const getRemainingDays = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusChip = (goal: Goal) => {
    const progress = goal.currentAmount / goal.targetAmount;
    const daysRemaining = getRemainingDays(goal.deadline);

    if (progress >= 1) return { label: 'Concluído', color: COLORS.success };
    if (daysRemaining < 30) return { label: 'Urgente', color: COLORS.error };
    if (progress >= 0.8) return { label: 'Quase lá!', color: COLORS.info };
    return { label: 'Em andamento', color: COLORS.warning };
  };

  return (
    <View style={styles.container}>
      {/* Header with filters */}
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Minhas Metas</Text>
          <IconButton
            icon="dots-vertical"
            onPress={() => setMenuVisible(true)}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={{ x: Dimensions.get('window').width - 50, y: 50 }}
          >
            <Menu.Item
              onPress={() => {
                setFilter('all');
                setMenuVisible(false);
              }}
              title="Todas"
            />
            <Menu.Item
              onPress={() => {
                setFilter('active');
                setMenuVisible(false);
              }}
              title="Em andamento"
            />
            <Menu.Item
              onPress={() => {
                setFilter('completed');
                setMenuVisible(false);
              }}
              title="Concluídas"
            />
          </Menu>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          <Chip
            selected={filter === 'all'}
            onPress={() => setFilter('all')}
            style={styles.filterChip}
          >
            Todas
          </Chip>
          <Chip
            selected={filter === 'travel'}
            onPress={() => setFilter('travel')}
            style={styles.filterChip}
          >
            Viagens
          </Chip>
          <Chip
            selected={filter === 'savings'}
            onPress={() => setFilter('savings')}
            style={styles.filterChip}
          >
            Economia
          </Chip>
          <Chip
            selected={filter === 'electronics'}
            onPress={() => setFilter('electronics')}
            style={styles.filterChip}
          >
            Eletrônicos
          </Chip>
        </ScrollView>
      </Surface>

      {/* Goals List */}
      <ScrollView style={styles.content}>
        {mockGoals
          .filter(goal => filter === 'all' || goal.category === filter)
          .map(goal => {
            const progress = goal.currentAmount / goal.targetAmount;
            const status = getStatusChip(goal);
            const daysRemaining = getRemainingDays(goal.deadline);

            return (
              <TouchableOpacity
                key={goal.id}
                onPress={() => {
                  setSelectedGoal(goal);
                  setModalVisible(true);
                }}
              >
                <Surface style={styles.goalCard} elevation={2}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleContainer}>
                      <MaterialCommunityIcons
                        name={getGoalIcon(goal.category)}
                        size={24}
                        color={theme.colors.primary}
                      />
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                    </View>
                    <Chip
                      style={[
                        styles.statusChip,
                        {
                          backgroundColor: status.color + '20',
                          minWidth: 90,
                          justifyContent: 'center'
                        }
                      ]}
                      textStyle={{ color: status.color }}
                    >
                      {status.label}
                    </Chip>
                  </View>

                  <View style={styles.goalProgress}>
                    <ProgressBar
                      progress={progress}
                      color={getProgressColor(goal.currentAmount, goal.targetAmount)}
                      style={styles.progressBar}
                    />
                    <View style={styles.goalAmounts}>
                      <Text style={styles.currentAmount}>
                        {formatCurrency(goal.currentAmount)}
                      </Text>
                      <Text style={styles.targetAmount}>
                        de {formatCurrency(goal.targetAmount)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.goalFooter}>
                    <Text style={styles.deadline}>
                      Prazo: {formatDate(goal.deadline)}
                    </Text>
                    <Text style={[
                      styles.daysRemaining,
                      { color: daysRemaining < 30 ? COLORS.error : COLORS.textSecondary }
                    ]}>
                      {daysRemaining} dias restantes
                    </Text>
                  </View>
                </Surface>
              </TouchableOpacity>
            );
          })}
      </ScrollView>

      {/* Add Goal FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddGoal')}
      />

      {/* Goal Details Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedGoal && (
            <View>
              <Text style={styles.modalTitle}>{selectedGoal.title}</Text>
              <Text style={styles.modalDescription}>{selectedGoal.description}</Text>
              
              <View style={styles.modalProgress}>
                <Text style={styles.modalProgressTitle}>Progresso</Text>
                <ProgressBar
                  progress={selectedGoal.currentAmount / selectedGoal.targetAmount}
                  color={getProgressColor(selectedGoal.currentAmount, selectedGoal.targetAmount)}
                  style={styles.modalProgressBar}
                />
                <Text style={styles.modalProgressText}>
                  {formatPercentage(selectedGoal.currentAmount / selectedGoal.targetAmount)}
                </Text>
              </View>

              <View style={styles.modalActions}>
                <Button
                  mode="contained"
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('AddTransaction', {
                      goalId: selectedGoal.id,
                      type: 'contribution'
                    });
                  }}
                >
                  Adicionar Valor
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setModalVisible(false)}
                  style={{ marginTop: 8 }}
                >
                  Fechar
                </Button>
              </View>
            </View>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  categoriesScroll: {
    marginTop: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  goalCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: COLORS.text,
  },
  statusChip: {
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  goalProgress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  goalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  currentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  targetAmount: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadline: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  daysRemaining: {
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.text,
  },
  modalDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  modalProgress: {
    marginBottom: 24,
  },
  modalProgressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.text,
  },
  modalProgressBar: {
    height: 12,
    borderRadius: 6,
  },
  modalProgressText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 8,
  },
  modalActions: {
    marginTop: 16,
  },
});

export default GoalsScreen; 