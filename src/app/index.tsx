import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {

  useEffect(() => {
    verificarLogin();
  }, []);

  async function verificarLogin() {
    try {
      const usuario = await AsyncStorage.getItem(
        'usuarioLogado'
      );

      if (usuario) {
        router.replace('/principal');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LinearGradient
      colors={['#031B4E', '#02153D', '#010C24']}
      style={styles.container}
    >
      <View style={styles.content}>

        <Image
          source={require('../../assets/images/logo-alerta-pessoal.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          ALERTA PESSOAL
        </Text>

        <Text style={styles.subtitle}>
          Monitore mandados de prisão vinculados ao seu CPF.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/cadastro')}
        >
          <Text style={styles.primaryButtonText}>
            QUERO ME CADASTRAR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.secondaryButtonText}>
            JÁ TENHO CADASTRO
          </Text>
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031B4E',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },

  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 28,
    marginTop: 20,
    marginBottom: 50,
  },

  primaryButton: {
    width: '100%',
    backgroundColor: '#F5B800',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 15,
  },

  primaryButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#02153D',
  },

  secondaryButton: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#F5B800',
    paddingVertical: 18,
    borderRadius: 12,
  },

  secondaryButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});
