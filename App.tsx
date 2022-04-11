//import { Dashboard } from './src/screens/Dashboard';
//import { Container } from './src/screens/Dashboard/styles';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { ThemeProvider } from 'styled-components';
import theme from './src/global/styles/theme';
//import { NavigationContainer } from '@react-navigation/native'; substituido pela linha abaixo
import { Routes } from './src/routes';
import { AppRoutes } from './src/routes/app.routes';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { Resume } from './src/Resume';
import { Register } from './src/Register';
import { SignIn } from './src/screens/SignIn';
import { useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold } from '@expo-google-fonts/poppins';
import { AuthContext } from './src/AuthContext';
import { AuthProvider, useAuth } from './src/hooks/auth';





export default function App() {
  const [ fontsLoaded ] = useFonts ({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

const { userStorageLoading } = useAuth();

// se as fontes ainda nao forem carregadas faremos um return segurando a tela de splash
  if(!fontsLoaded || userStorageLoading) {
    return (
       <AppLoading />
      
    )
  }

  return (
    <ThemeProvider theme={theme}>
      
        <StatusBar style="light" />
        <AuthProvider >
          <Routes />
        </AuthProvider>
      
    </ThemeProvider>
    );
}

//  <AppRoutes /> depois tira o SignIn e poe isso novamente 
/*
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your appXXX!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/