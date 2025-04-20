import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import {
  Surface,
  Text,
  Avatar,
  Button,
  useTheme,
  Divider,
  List,
  Switch,
  IconButton,
  Menu,
  Portal,
  Dialog,
  TextInput,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatters';

// Mock data para o perfil do usuário
const mockUserData = {
  name: 'João Silva',
  email: 'joao.silva@email.com',
  photo: null, // URL da foto do perfil
  joinDate: new Date('2023-01-15'),
  totalTransactions: 156,
  totalSavings: 12500.75,
  monthlyAverage: 3200.50,
  goalsCompleted: 3,
  currentGoals: 2,
  notifications: true,
  darkMode: false,
  currency: 'BRL',
  language: 'Português',
};

export default function ProfileScreen({ navigation }: any) {
  const theme = useTheme();
  const [userData, setUserData] = useState(mockUserData);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(userData.name);
  const [editEmail, setEditEmail] = useState(userData.email);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const handleSaveProfile = () => {
    setUserData({
      ...userData,
      name: editName,
      email: editEmail,
    });
    setShowEditDialog(false);
    setEditMode(false);
  };

  const handleToggleNotifications = () => {
    setUserData({
      ...userData,
      notifications: !userData.notifications,
    });
  };

  const handleToggleDarkMode = () => {
    setUserData({
      ...userData,
      darkMode: !userData.darkMode,
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: () => navigation.navigate('Login'),
        },
      ],
      { cancelable: true }
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      paddingTop: 40,
      paddingBottom: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 4,
    },
    headerContent: {
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    avatarContainer: {
      marginBottom: 10,
    },
    avatar: {
      backgroundColor: theme.colors.surface,
      width: 100,
      height: 100,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.onPrimary,
      marginTop: 10,
    },
    userEmail: {
      fontSize: 16,
      color: theme.colors.onPrimary,
      opacity: 0.8,
    },
    editButton: {
      position: 'absolute',
      right: 20,
      top: 20,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: 10,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    statCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 15,
      width: '48%',
      marginBottom: 15,
      elevation: 2,
    },
    statTitle: {
      fontSize: 14,
      color: theme.colors.onSurface,
      opacity: 0.7,
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginTop: 5,
    },
    divider: {
      marginVertical: 15,
    },
    logoutButton: {
      marginTop: 20,
      marginBottom: 30,
    },
    dialogContent: {
      paddingTop: 10,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header com foto e informações do usuário */}
      <Surface style={styles.header} elevation={4}>
        <View style={styles.headerContent}>
          <IconButton
            icon="cog"
            size={24}
            iconColor={theme.colors.onPrimary}
            style={styles.editButton}
            onPress={() => setShowSettingsMenu(true)}
          />
          <View style={styles.avatarContainer}>
            {userData.photo ? (
              <Avatar.Image
                size={100}
                source={{ uri: userData.photo }}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Icon
                size={100}
                icon="account"
                style={styles.avatar}
                color={theme.colors.primary}
              />
            )}
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <Button
            mode="contained"
            onPress={() => setShowEditDialog(true)}
            style={{ marginTop: 10 }}
            labelStyle={{ color: theme.colors.primary }}
            buttonColor={theme.colors.surface}
          >
            Editar Perfil
          </Button>
        </View>
      </Surface>

      <ScrollView style={styles.content}>
        {/* Estatísticas Financeiras */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas Financeiras</Text>
          <View style={styles.statsContainer}>
            <Surface style={styles.statCard} elevation={2}>
              <Text style={styles.statTitle}>Total Economizado</Text>
              <Text style={styles.statValue}>{formatCurrency(userData.totalSavings)}</Text>
            </Surface>
            <Surface style={styles.statCard} elevation={2}>
              <Text style={styles.statTitle}>Média Mensal</Text>
              <Text style={styles.statValue}>{formatCurrency(userData.monthlyAverage)}</Text>
            </Surface>
            <Surface style={styles.statCard} elevation={2}>
              <Text style={styles.statTitle}>Transações</Text>
              <Text style={styles.statValue}>{userData.totalTransactions}</Text>
            </Surface>
            <Surface style={styles.statCard} elevation={2}>
              <Text style={styles.statTitle}>Metas Concluídas</Text>
              <Text style={styles.statValue}>{userData.goalsCompleted}</Text>
            </Surface>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Metas Atuais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metas Atuais</Text>
          <Surface style={{ borderRadius: 12, padding: 15, elevation: 2 }}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              Você tem {userData.currentGoals} metas em andamento
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Goals')}
              style={{ marginTop: 5 }}
            >
              Ver Minhas Metas
            </Button>
          </Surface>
        </View>

        <Divider style={styles.divider} />

        {/* Preferências */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          <Surface style={{ borderRadius: 12, elevation: 2 }}>
            <List.Item
              title="Notificações"
              description="Receber alertas e lembretes"
              left={props => <List.Icon {...props} icon="bell-outline" />}
              right={() => (
                <Switch
                  value={userData.notifications}
                  onValueChange={handleToggleNotifications}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Modo Escuro"
              description="Tema escuro para o aplicativo"
              left={props => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={userData.darkMode}
                  onValueChange={handleToggleDarkMode}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Moeda"
              description={userData.currency}
              left={props => <List.Icon {...props} icon="currency-brl" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Idioma"
              description={userData.language}
              left={props => <List.Icon {...props} icon="translate" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
          </Surface>
        </View>

        <Divider style={styles.divider} />

        {/* Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <Surface style={{ borderRadius: 12, elevation: 2 }}>
            <List.Item
              title="Membro desde"
              description={userData.joinDate.toLocaleDateString('pt-BR')}
              left={props => <List.Icon {...props} icon="calendar" />}
            />
            <Divider />
            <List.Item
              title="Alterar Senha"
              left={props => <List.Icon {...props} icon="lock" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Exportar Dados"
              left={props => <List.Icon {...props} icon="database-export" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Ajuda e Suporte"
              left={props => <List.Icon {...props} icon="help-circle" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
          </Surface>
        </View>

        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
        >
          Sair da Conta
        </Button>
      </ScrollView>

      {/* Menu de Configurações */}
      <Menu
        visible={showSettingsMenu}
        onDismiss={() => setShowSettingsMenu(false)}
        anchor={{ x: 350, y: 50 }}
      >
        <Menu.Item
          onPress={() => {
            setShowSettingsMenu(false);
            navigation.navigate('Settings');
          }}
          title="Configurações"
          leadingIcon="cog"
        />
        <Menu.Item
          onPress={() => {
            setShowSettingsMenu(false);
            navigation.navigate('Help');
          }}
          title="Ajuda"
          leadingIcon="help-circle"
        />
        <Menu.Item
          onPress={() => {
            setShowSettingsMenu(false);
            navigation.navigate('About');
          }}
          title="Sobre"
          leadingIcon="information"
        />
      </Menu>

      {/* Dialog de Edição de Perfil */}
      <Portal>
        <Dialog visible={showEditDialog} onDismiss={() => setShowEditDialog(false)}>
          <Dialog.Title>Editar Perfil</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <TextInput
              label="Nome"
              value={editName}
              onChangeText={setEditName}
              mode="outlined"
              style={{ marginBottom: 15 }}
            />
            <TextInput
              label="E-mail"
              value={editEmail}
              onChangeText={setEditEmail}
              mode="outlined"
              keyboardType="email-address"
              style={{ marginBottom: 15 }}
            />
            <Button
              mode="contained"
              onPress={handleSaveProfile}
              style={{ marginTop: 10 }}
            >
              Salvar
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
} 