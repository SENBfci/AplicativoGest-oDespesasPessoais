import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import {
  Surface,
  Text,
  TextInput,
  Button,
  useTheme,
  HelperText,
  IconButton,
  Menu,
  Card,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { formatCurrency } from '../utils/formatters';

interface FormData {
  title: string;
  description: string;
  targetAmount: string;
  category: string;
  deadline: Date;
}

interface FormErrors {
  title?: string;
  targetAmount?: string;
  category?: string;
  deadline?: string;
}

type CategoryType = {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const categories: CategoryType[] = [
  { id: 'travel', name: 'Viagem', icon: 'airplane' },
  { id: 'savings', name: 'Economia', icon: 'piggy-bank' },
  { id: 'electronics', name: 'Eletrônicos', icon: 'laptop' },
  { id: 'car', name: 'Carro', icon: 'car' },
  { id: 'home', name: 'Casa', icon: 'home' },
  { id: 'education', name: 'Educação', icon: 'school' },
  { id: 'other', name: 'Outro', icon: 'star' },
];

export default function AddGoalScreen({ navigation }: any) {
  const theme = useTheme();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    targetAmount: '',
    category: '',
    deadline: new Date(),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'O título é obrigatório';
    }

    const amount = parseFloat(formData.targetAmount.replace(/[^\d,]/g, '').replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      newErrors.targetAmount = 'Insira um valor válido';
    }

    if (!formData.category) {
      newErrors.category = 'Selecione uma categoria';
    }

    if (formData.deadline < new Date()) {
      newErrors.deadline = 'A data deve ser futura';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: Implementar criação da meta
      navigation.goBack();
    }
  };

  const handleAmountChange = (text: string) => {
    // Remove caracteres não numéricos
    const numericValue = text.replace(/[^\d]/g, '');
    
    // Converte para formato de moeda
    const amount = (parseFloat(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    setFormData({ ...formData, targetAmount: amount });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    scrollView: {
      flex: 1,
    },
    mainCard: {
      margin: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginBottom: 12,
    },
    input: {
      backgroundColor: theme.colors.surface,
    },
    divider: {
      marginVertical: 16,
    },
    categoryButton: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      borderColor: errors.category ? '#FF0000' : theme.colors.primary
    },
    dateButton: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      borderColor: errors.deadline ? '#FF0000' : theme.colors.primary
    },
    errorButton: {
      borderColor: theme.colors.error,
    },
    datePickerIOS: {
      width: '100%',
      height: 200,
      marginTop: 10,
    },
    submitButton: {
      margin: 16,
      marginTop: 0,
      paddingVertical: 8,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Nova Meta</Text>
          <IconButton
            icon="check"
            size={24}
            onPress={handleSubmit}
            disabled={Object.keys(errors).length > 0}
          />
        </View>
      </Surface>

      <ScrollView style={styles.scrollView}>
        {/* Card Principal */}
        <Card style={styles.mainCard}>
          <Card.Content>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações Básicas</Text>
              <TextInput
                label="Título da Meta"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                mode="outlined"
                error={!!errors.title}
                style={styles.input}
                placeholder="Ex: Viagem para Europa"
              />
              <HelperText type="error" visible={!!errors.title}>
                {errors.title}
              </HelperText>

              <TextInput
                label="Descrição"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                placeholder="Descreva sua meta em detalhes..."
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Valor e Categoria</Text>
              <TextInput
                label="Valor da Meta"
                value={formData.targetAmount}
                onChangeText={handleAmountChange}
                mode="outlined"
                keyboardType="numeric"
                error={!!errors.targetAmount}
                style={styles.input}
                placeholder="R$ 0,00"
                right={<TextInput.Icon icon="currency-brl" />}
              />
              <HelperText type="error" visible={!!errors.targetAmount}>
                {errors.targetAmount}
              </HelperText>

              <Menu
                visible={showCategoryMenu}
                onDismiss={() => setShowCategoryMenu(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setShowCategoryMenu(true)}
                    style={[
                      styles.categoryButton,
                      {
                        borderColor: errors.category ? '#FF0000' : theme.colors.primary
                      },
                      !!errors.category && styles.errorButton
                    ]}
                    icon={() => (
                      <MaterialCommunityIcons
                        name={(categories.find(c => c.id === formData.category)?.icon || 'shape') as keyof typeof MaterialCommunityIcons.glyphMap}
                        size={24}
                        color={errors.category ? '#FF0000' : theme.colors.primary}
                      />
                    )}
                    textColor={errors.category ? '#FF0000' : undefined}
                  >
                    {formData.category ? 
                      categories.find(c => c.id === formData.category)?.name : 
                      'Selecione uma categoria'}
                  </Button>
                }
              >
                {categories.map((category) => (
                  <Menu.Item
                    key={category.id}
                    onPress={() => {
                      setFormData({ ...formData, category: category.id });
                      setShowCategoryMenu(false);
                    }}
                    title={category.name}
                    leadingIcon={() => (
                      <MaterialCommunityIcons
                        name={category.icon}
                        size={24}
                        color={theme.colors.primary}
                      />
                    )}
                  />
                ))}
              </Menu>
              <HelperText type="error" visible={!!errors.category}>
                {errors.category}
              </HelperText>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Limite</Text>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={[
                  styles.dateButton,
                  {
                    borderColor: errors.deadline ? '#FF0000' : theme.colors.primary
                  },
                  !!errors.deadline && styles.errorButton
                ]}
                icon="calendar"
                textColor={errors.deadline ? '#FF0000' : undefined}
              >
                {formData.deadline.toLocaleDateString('pt-BR')}
              </Button>
              <HelperText type="error" visible={!!errors.deadline}>
                {errors.deadline}
              </HelperText>

              {(showDatePicker || Platform.OS === 'ios') && (
                <DateTimePicker
                  value={formData.deadline}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                    if (Platform.OS === 'android') {
                      setShowDatePicker(false);
                    }
                    if (event.type === 'set' && selectedDate) {
                      setFormData({ ...formData, deadline: selectedDate });
                    }
                  }}
                  minimumDate={new Date()}
                  style={Platform.OS === 'ios' ? styles.datePickerIOS : undefined}
                />
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Botão de Salvar para iOS */}
        {Platform.OS === 'ios' && (
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={Object.keys(errors).length > 0}
          >
            Criar Meta
          </Button>
        )}
      </ScrollView>
    </View>
  );
} 