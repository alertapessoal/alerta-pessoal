import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { api, salvarSessao } from '../lib/api';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [codigoIndicacao, setCodigoIndicacao] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const validarCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) return false;

    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += Number(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== Number(cpf.substring(9, 10))) {
      return false;
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
      soma += Number(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== Number(cpf.substring(10, 11))) {
      return false;
    }

    return true;
  };

  const validarSenha = (senha: string) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;
    return regex.test(senha);
  };

  const cadastrar = async () => {
    try {
      if (!aceitouTermos) {
        Alert.alert(
          'Termos de Uso',
          'Você precisa aceitar os Termos de Uso.'
        );
        return;
      }

      if (
        !nome ||
        !cpf ||
        !email ||
        !telefone ||
        !senha ||
        !confirmarSenha
      ) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
      }

      if (!validarCPF(cpf)) {
        Alert.alert('CPF inválido', 'Informe um CPF válido.');
        return;
      }

      if (!validarSenha(senha)) {
        Alert.alert(
          'Senha inválida',
          'A senha deve conter:\n\n' +
          '• Mínimo de 8 caracteres\n' +
          '• Pelo menos 1 letra maiúscula\n' +
          '• Pelo menos 1 número\n' +
          '• Pelo menos 1 caractere especial'
        );
        return;
      }

      if (senha !== confirmarSenha) {
        Alert.alert('Erro', 'As senhas não conferem.');
        return;
      }

      setCarregando(true);

      const resultado = await api.post(
        '/auth/cadastro',
        {
          nome,
          email,
          cpf,
          telefone,
          senha,
          codigoIndicacao: codigoIndicacao || undefined,
        },
        false
      );

      await salvarSessao(resultado.token, resultado.usuario);

      router.replace('/principal');

    } catch (erro: any) {
      Alert.alert('Erro', erro?.message || 'Erro inesperado');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

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

        <Text style={styles.title}>Cadastro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={cpf}
          onChangeText={setCpf}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />

        <TextInput
          style={styles.input}
          placeholder="Código de indicação (opcional)"
          placeholderTextColor="#999"
          autoCapitalize="characters"
          value={codigoIndicacao}
          onChangeText={setCodigoIndicacao}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <Text style={styles.regraSenha}>
          A senha deve conter:
          {'\n'}• Mínimo de 8 caracteres
          {'\n'}• 1 letra maiúscula
          {'\n'}• 1 número
          {'\n'}• 1 caractere especial
        </Text>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAceitouTermos(!aceitouTermos)}
        >
          <View
            style={[
              styles.checkbox,
              aceitouTermos && styles.checkboxChecked,
            ]}
          />

          <Text style={styles.checkboxText}>
            Li e aceito os Termos de Uso e Política de Privacidade
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={cadastrar}
          style={[
            styles.button,
            {
              backgroundColor:
                aceitouTermos && !carregando
                  ? '#F5B800'
                  : '#666666',
            },
          ]}
          disabled={!aceitouTermos || carregando}
        >
          <Text style={styles.buttonText}>
            {carregando ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#031B4E',
    justifyContent: 'center',
    padding: 25,
    paddingTop: 80,
    paddingBottom: 40,
  },

  voltarButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 15,
    fontSize: 16,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#F5B800',
    borderRadius: 4,
    marginRight: 10,
  },

  checkboxChecked: {
    backgroundColor: '#F5B800',
  },

  checkboxText: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 13,
  },

  button: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#02153D',
    fontWeight: 'bold',
    fontSize: 18,
  },

  regraSenha: {
    color: '#FFFFFF',
    fontSize: 13,
    marginBottom: 15,
    lineHeight: 20,
  },
});
