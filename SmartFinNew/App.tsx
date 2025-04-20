import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from './src/theme/theme';
import Navigation from './src/navigation';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <PaperProvider theme={lightTheme}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </PaperProvider>
  );
}
