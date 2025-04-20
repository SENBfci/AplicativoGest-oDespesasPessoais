import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  IconButton,
  useTheme,
  MD3Colors,
  Switch,
  HelperText,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TransactionType, Frequency } from '../types/transactions';

type InputMethod = 'manual' | 'receipt';

const categories = [
  { id: '1', name: 'Alimentação', icon: 'food' as const },
  { id: '2', name: 'Transporte', icon: 'car' as const },
  { id: '3', name: 'Lazer', icon: 'movie' as const },
  { id: '4', name: 'Saúde', icon: 'medical-bag' as const },
  { id: '5', name: 'Educação', icon: 'school' as const },
  { id: '6', name: 'Moradia', icon: 'home' as const },
  { id: '7', name: 'Outros', icon: 'dots-horizontal' as const },
] as const;

export default function TransactionScreen() {
  const theme = useTheme();
  const [inputMethod, setInputMethod] = useState<InputMethod>('manual');
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [dueDay, setDueDay] = useState('');

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('É necessário permissão para acessar a câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
      // TODO: Implementar OCR para extrair dados do comprovante
    }
  };

  const handleSubmit = () => {
    console.log({
      type,
      amount,
      description,
      selectedCategory,
      receiptImage,
      isFixed,
      ...(isFixed && {
        frequency,
        dueDay: parseInt(dueDay),
      }),
    });
  };

  const formatAmount = (text: string) => {
    const numbers = text.replace(/[^\d]/g, '');
    const amount = (parseInt(numbers) / 100).toFixed(2);
    setAmount(amount);
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
            Nova Transação
          </Text>

          <Surface style={styles.inputMethodContainer} elevation={1}>
            <TouchableOpacity
              style={[
                styles.methodOption,
                inputMethod === 'manual' && styles.methodOptionSelected,
              ]}
              onPress={() => setInputMethod('manual')}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={32}
                color={inputMethod === 'manual' ? theme.colors.primary : theme.colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.methodText,
                  inputMethod === 'manual' && { color: theme.colors.primary },
                ]}
              >
                Manual
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodOption,
                inputMethod === 'receipt' && styles.methodOptionSelected,
              ]}
              onPress={() => {
                setInputMethod('receipt');
                handleTakePhoto();
              }}
            >
              <MaterialCommunityIcons
                name="camera-outline"
                size={32}
                color={inputMethod === 'receipt' ? theme.colors.primary : theme.colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.methodText,
                  inputMethod === 'receipt' && { color: theme.colors.primary },
                ]}
              >
                Comprovante
              </Text>
            </TouchableOpacity>
          </Surface>

          {receiptImage && (
            <Surface style={styles.receiptContainer} elevation={1}>
              <View style={styles.receiptImageContainer}>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setReceiptImage(null)}
                  style={styles.removeReceiptButton}
                />
                <View style={styles.receiptThumbnail}>
                  <MaterialCommunityIcons name="file-image-outline" size={40} color={theme.colors.primary} />
                </View>
                <Text style={styles.receiptFileName}>Comprovante</Text>
                <IconButton
                  icon="camera-retake"
                  size={24}
                  onPress={handleTakePhoto}
                  style={styles.retakeButton}
                />
              </View>
            </Surface>
          )}

          <Surface style={styles.formContainer} elevation={1}>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  type === 'expense' && styles.typeOptionSelected,
                ]}
                onPress={() => setType('expense')}
              >
                <MaterialCommunityIcons
                  name="arrow-down"
                  size={24}
                  color={type === 'expense' ? '#fff' : theme.colors.onSurfaceVariant}
                />
                <Text style={[
                  styles.typeText,
                  type === 'expense' && styles.typeTextSelected,
                ]}>
                  Despesa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeOption,
                  type === 'income' && styles.typeOptionSelected,
                ]}
                onPress={() => setType('income')}
              >
                <MaterialCommunityIcons
                  name="arrow-up"
                  size={24}
                  color={type === 'income' ? '#fff' : theme.colors.onSurfaceVariant}
                />
                <Text style={[
                  styles.typeText,
                  type === 'income' && styles.typeTextSelected,
                ]}>
                  Receita
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              label="Valor"
              value={amount}
              onChangeText={formatAmount}
              keyboardType="numeric"
              style={styles.input}
              left={<TextInput.Affix text="R$ " />}
              mode="outlined"
            />

            <TextInput
              label="Descrição"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              mode="outlined"
            />

            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => setShowCategories(!showCategories)}
            >
              <MaterialCommunityIcons
                name={(selectedCategoryData?.icon || 'folder-outline') as any}
                size={24}
                color="#2196F3"
              />
              <Text style={styles.categoryButtonText}>
                {selectedCategoryData?.name || 'Selecione uma categoria'}
              </Text>
              <MaterialCommunityIcons
                name={showCategories ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>

            {showCategories && (
              <View style={styles.categoriesList}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      selectedCategory === category.id && styles.categoryItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.id);
                      setShowCategories(false);
                    }}
                  >
                    <MaterialCommunityIcons
                      name={category.icon}
                      size={24}
                      color={selectedCategory === category.id ? theme.colors.primary : theme.colors.onSurfaceVariant}
                    />
                    <Text style={[
                      styles.categoryItemText,
                      selectedCategory === category.id && { color: theme.colors.primary },
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.fixedTransactionContainer}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Transação Fixa</Text>
                <Switch
                  value={isFixed}
                  onValueChange={setIsFixed}
                  color={theme.colors.primary}
                />
              </View>
              
              {isFixed && (
                <>
                  <TextInput
                    label="Dia do vencimento"
                    value={dueDay}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      if (parseInt(numericValue) <= 31) {
                        setDueDay(numericValue);
                      }
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <HelperText type="info">
                    Dia do mês em que a transação será repetida
                  </HelperText>
                  
                  <View style={styles.frequencyContainer}>
                    <Text style={styles.frequencyLabel}>Frequência:</Text>
                    <View style={styles.frequencyButtons}>
                      {(['monthly', 'yearly'] as Frequency[]).map((freq) => (
                        <TouchableOpacity
                          key={freq}
                          style={[
                            styles.frequencyButton,
                            frequency === freq && styles.frequencyButtonSelected,
                          ]}
                          onPress={() => setFrequency(freq)}
                        >
                          <Text
                            style={[
                              styles.frequencyButtonText,
                              frequency === freq && styles.frequencyButtonTextSelected,
                            ]}
                          >
                            {freq === 'monthly' ? 'Mensal' : 'Anual'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              )}
            </View>
          </Surface>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            Salvar Transação
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginVertical: 24,
    textAlign: 'center',
  },
  inputMethodContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  methodOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  methodOptionSelected: {
    backgroundColor: 'rgba(33, 150, 243, 0.12)',
  },
  methodText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  receiptContainer: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  receiptImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  receiptThumbnail: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.12)',
    borderRadius: 8,
    marginRight: 12,
  },
  receiptFileName: {
    flex: 1,
    fontSize: 16,
  },
  removeReceiptButton: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  retakeButton: {
    marginLeft: 8,
  },
  formContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  typeOptionSelected: {
    backgroundColor: '#2196F3',
  },
  typeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  typeTextSelected: {
    color: '#fff',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  categoryButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#444',
  },
  categoriesList: {
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryItemSelected: {
    backgroundColor: 'rgba(33, 150, 243, 0.12)',
  },
  categoryItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#444',
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
  },
  submitButtonContent: {
    height: 48,
  },
  fixedTransactionContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: MD3Colors.neutral95,
    borderRadius: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: MD3Colors.neutral20,
  },
  frequencyContainer: {
    marginTop: 16,
  },
  frequencyLabel: {
    fontSize: 16,
    color: MD3Colors.neutral20,
    marginBottom: 8,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MD3Colors.neutral60,
    alignItems: 'center',
  },
  frequencyButtonSelected: {
    backgroundColor: MD3Colors.primary40,
    borderColor: MD3Colors.primary40,
  },
  frequencyButtonText: {
    fontSize: 14,
    color: MD3Colors.neutral20,
  },
  frequencyButtonTextSelected: {
    color: '#fff',
  },
}); 