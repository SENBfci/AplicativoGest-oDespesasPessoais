import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  Surface,
  Text,
  useTheme,
  TextInput,
  Button,
  IconButton,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TransactionType, Frequency, FixedTransaction } from '../types/transactions';
import { COLORS } from '../theme/colors';

// Dados mockados para exemplo
const mockFixedTransactions: FixedTransaction[] = [
  {
    id: 1,
    description: 'Aluguel',
    amount: 1500,
    category: 'Moradia',
    date: 5,
    frequency: 'monthly',
    icon: 'home-outline',
    type: 'expense',
  },
  {
    id: 2,
    description: 'Salário',
    amount: 5000,
    category: 'Receita',
    date: 5,
    frequency: 'monthly',
    icon: 'cash',
    type: 'income',
  },
  {
    id: 3,
    description: 'Netflix',
    amount: 39.90,
    category: 'Lazer',
    date: 15,
    frequency: 'monthly',
    icon: 'movie-outline',
    type: 'expense',
  },
];

export default function FixedTransactionsScreen() {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    frequency: 'monthly' as Frequency,
    type: 'expense' as TransactionType,
  });

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  const getTransactionColor = (type: TransactionType) => {
    return type === 'income' ? COLORS.transaction.income : COLORS.transaction.expense;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <Surface style={styles.summaryCard} elevation={2}>
          <Text style={styles.summaryTitle}>Transações Fixas</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.primaryLight }]}>
                <MaterialCommunityIcons 
                  name="arrow-up" 
                  size={24} 
                  color={COLORS.transaction.income}
                />
              </View>
              <Text style={styles.summaryLabel}>Receitas Fixas</Text>
              <Text style={[styles.summaryValue, { color: COLORS.transaction.income }]}>
                R$ 5.000,00
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.primaryLight }]}>
                <MaterialCommunityIcons 
                  name="arrow-down" 
                  size={24} 
                  color={COLORS.transaction.expense}
                />
              </View>
              <Text style={styles.summaryLabel}>Despesas Fixas</Text>
              <Text style={[styles.summaryValue, { color: COLORS.transaction.expense }]}>
                R$ 1.539,90
              </Text>
            </View>
          </View>
        </Surface>

        {mockFixedTransactions.map((transaction, index) => (
          <React.Fragment key={transaction.id}>
            <Surface style={styles.transactionCard} elevation={2}>
              <View style={styles.transaction}>
                <View style={[styles.transactionIcon, { backgroundColor: COLORS.primaryLight }]}>
                  <MaterialCommunityIcons 
                    name={transaction.icon} 
                    size={24} 
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDetails}>
                    Todo dia {transaction.date} • {transaction.category}
                  </Text>
                </View>
                <Text style={[styles.transactionAmount, { color: getTransactionColor(transaction.type) }]}>
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
            </Surface>
            {index < mockFixedTransactions.length - 1 && <View style={styles.spacer} />}
          </React.Fragment>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: COLORS.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Surface style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Transação Fixa</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setModalVisible(false)}
              />
            </View>
            <Divider style={styles.divider} />
            
            <View style={styles.modalBody}>
              <TextInput
                label="Descrição"
                value={newTransaction.description}
                onChangeText={(text) => setNewTransaction({ ...newTransaction, description: text })}
                style={styles.input}
              />
              <TextInput
                label="Valor"
                value={newTransaction.amount}
                onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Categoria"
                value={newTransaction.category}
                onChangeText={(text) => setNewTransaction({ ...newTransaction, category: text })}
                style={styles.input}
              />
              <TextInput
                label="Dia do mês"
                value={newTransaction.date}
                onChangeText={(text) => setNewTransaction({ ...newTransaction, date: text })}
                keyboardType="numeric"
                style={styles.input}
              />
              
              <View style={styles.buttonGroup}>
                <Button
                  mode={newTransaction.type === 'expense' ? 'contained' : 'outlined'}
                  onPress={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                  style={styles.typeButton}
                >
                  Despesa
                </Button>
                <Button
                  mode={newTransaction.type === 'income' ? 'contained' : 'outlined'}
                  onPress={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                  style={styles.typeButton}
                >
                  Receita
                </Button>
              </View>

              <Button
                mode="contained"
                onPress={() => {
                  // Lógica para salvar a transação
                  setModalVisible(false);
                }}
                style={styles.saveButton}
              >
                Salvar
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  transactionCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  modalBody: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  saveButton: {
    marginTop: 8,
  },
  divider: {
    backgroundColor: COLORS.border.default,
    marginVertical: 8,
  },
}); 
