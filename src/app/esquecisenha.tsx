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

import { api } from '../lib/api';

type Etapa = 'cpf' | 'codigo';

function limparCpf(valor: string) {
  return valor.replace(/\D/g, '');
}

function formatarCpf(valor: string) {
  const d = limparCpf(valor).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export default function EsqueciSenhaScreen() {
  const [etapa, setEtapa] = useState<Etapa>('cpf');

  const [cpf, setCpf] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [carregando, setCarregando] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Etapa 1: Enviar CPF → receber código por e-mail
  |--------------------------------------------------------------------------
  */
  async function aoEnviarCpf() {
    const cpfLimpo = limparCpf(cpf);

    if (cpfLimpo.length !== 11) {
      Alert.alert('Erro', 'Informe um CPF válido com 11 dígitos.');
      return;
    }

    setCarregando(true);

    try {
      await api.post('/auth/esqueci-senha', { cpf: cpfLimpo }, false);

      setEtapa('codigo');

      Alert.alert(
        'Código enviado',
        'Se o CPF estiver cadastrado, você receberá um código de 6 dígitos por e-mail. Verifique sua caixa de entrada.'
      );
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Não foi possível enviar o código. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Etapa 2: Validar código + definir nova senha
  |--------------------------------------------------------------------------
  */
  async function aoRedefinirSenha() {
    const cpfLimpo = limparCpf(cpf);
    const codigoLimpo = codigo.trim();

    if (codigoLimpo.length !== 6) {
      Alert.alert('Erro', 'Informe o código de 6 dígitos recebido por e-mail.');
      return;
    }

    if (novaSenha.length < 8) {
      Alert.alert('Erro', 'A nova senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setCarregando(true);

    try {
      await api.post(
        '/auth/redefinir-senha',
        { cpf: cpfLimpo, codigo: codigoLimpo, novaSenha },
        false
      );

      Alert.alert(
        'Senha redefinida!',
        'Sua senha foi atualizada com sucesso. Faça login com a nova senha.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Código inválido ou expirado. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >

        <TouchableOpacity
          style={styles.voltarButton}
          onPress={() =>
            etapa === 'codigo' ? setEtapa('cpf') : router.back()
          }
        >
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.title}>
          {etapa === 'cpf' ? 'Recuperar senha' : 'Nova senha'}
        </Text>

        <Text style={styles.subtitulo}>
          {etapa === 'cpf'
            ? 'Informe seu CPF para receber um código de verificação por e-mail.'
            : 'Digite o código de 6 dígitos recebido por e-mail e crie uma nova senha.'}
        </Text>

        {/* ── Etapa 1: CPF ── */}
        {etapa === 'cpf' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="CPF"
              placeholderTextColor="#999"
              value={cpf}
              onChangeText={(v) => setCpf(formatarCpf(v))}
              keyboardType="numeric"
              autoCapitalize="none"
              maxLength={14}
            />

            <TouchableOpacity
              style={[styles.button, carregando && styles.buttonDesabilitado]}
              onPress={aoEnviarCpf}
              disabled={carregando}
            >
              <Text style={styles.buttonText}>
                {carregando ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── Etapa 2: Código + nova senha ── */}
        {etapa === 'codigo' && (
          <>
            <TextInput
              style={[styles.input, styles.inputCodigo]}
              placeholder="000000"
              placeholderTextColor="#999"
              value={codigo}
              onChangeText={(v) => setCodigo(v.replace(/\D/g, '').slice(0, 6))}
              keyboardType="numeric"
              maxLength={6}
            />

            <TextInput
              style={styles.input}
              placeholder="Nova senha (mín. 8 caracteres)"
              placeholderTextColor="#999"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar nova senha"
              placeholderTextColor="#999"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.button, carregando && styles.buttonDesabilitado]}
              onPress={aoRedefinirSenha}
              disabled={carregando}
            >
              <Text style={styles.buttonText}>
                {carregando ? 'SALVANDO...' : 'REDEFINIR SENHA'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reenviarButton}
              onPress={aoEnviarCpf}
              disabled={carregando}
            >
              <Text style={styles.reenviarText}>
                Não recebeu o código? Reenviar
              </Text>
            </TouchableOpacity>
          </>
        )}

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
    top: 50,
    left: 20,
    zIndex: 10,
  },

  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitulo: {
    color: '#AAB8D4',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },

  input: {
    backgroundColor: '#FFF',
    height: 55,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },

  inputCodigo: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 12,
  },

  button: {
    backgroundColor: '#F5B800',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  buttonDesabilitado: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#02153D',
    fontSize: 18,
    fontWeight: 'bold',
  },

  reenviarButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  reenviarText: {
    color: '#F5B800',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
