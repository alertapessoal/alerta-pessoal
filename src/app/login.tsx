import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { api, salvarSessao } from '../lib/api';

export default function LoginScreen() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const fazerLogin = async () => {
    try {
      if (!login || !senha) {
        Alert.alert(
          'Erro',
          'Preencha CPF/E-mail e senha.'
        );
        return;
      }

      const resultado = await api.post(
        '/auth/login',
        { identificador: login, senha },
        false
      );

      await salvarSessao(resultado.token, resultado.usuario);

      router.replace('/principal');

    } catch (erro: any) {
      Alert.alert(
        'Erro',
        erro?.message || 'Erro inesperado'
      );
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.voltarButton}
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={28}
          color="#FFF"
        />
      </TouchableOpacity>

      <Text style={styles.title}>
        Entrar
      </Text>

      <TextInput
        style={styles.input}
        placeholder="CPF ou E-mail"
        placeholderTextColor="#999"
        value={login}
        onChangeText={setLogin}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={() =>
          router.push('/esquecisenha')
        }
      >
        <Text style={styles.esqueciSenha}>
          Esqueci minha senha
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={fazerLogin}
      >
        <Text style={styles.buttonText}>
          ENTRAR
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cadastroButton}
        onPress={() =>
          router.push('/cadastro')
        }
      >
        <Text style={styles.cadastroText}>
          Criar uma conta
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031B4E',
    justifyContent: 'center',
    padding: 25,
  },

  voltarButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },

  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    backgroundColor: '#FFF',
    height: 55,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000000',
  },

  esqueciSenha: {
    color: '#F5B800',
    textAlign: 'right',
    marginBottom: 20,
    fontSize: 15,
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#F5B800',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#02153D',
    fontSize: 18,
    fontWeight: 'bold',
  },

  cadastroButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  cadastroText: {
    color: '#FFF',
    fontSize: 16,
  },
});
