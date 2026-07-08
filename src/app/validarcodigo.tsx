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

import { supabase } from '../lib/supabase';

export default function ValidarCodigoScreen() {
  const [cpf, setCpf] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const validarSenha = (senha: string) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;

    return regex.test(senha);
  };

  const alterarSenha = async () => {
    try {
      if (
        !cpf ||
        !codigo ||
        !novaSenha ||
        !confirmarSenha
      ) {
        Alert.alert(
          'Erro',
          'Preencha todos os campos.'
        );
        return;
      }

      if (novaSenha !== confirmarSenha) {
        Alert.alert(
          'Erro',
          'As senhas não conferem.'
        );
        return;
      }

      if (!validarSenha(novaSenha)) {
        Alert.alert(
          'Senha inválida',
          'A senha deve conter:\n\n' +
          '• Mínimo 8 caracteres\n' +
          '• Pelo menos 1 letra maiúscula\n' +
          '• Pelo menos 1 número\n' +
          '• Pelo menos 1 caractere especial'
        );
        return;
      }

      const recuperacao = await supabase
        .from('recuperacao_senha')
        .select('*')
        .eq('cpf', cpf)
        .eq('codigo', codigo)
        .eq('utilizado', false)
        .order('created_at', {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (
        recuperacao.error ||
        !recuperacao.data
      ) {
        Alert.alert(
          'Erro',
          'Código inválido.'
        );
        return;
      }

      const agora = new Date();
      const expira = new Date(
        recuperacao.data.expira_em
      );

      if (agora > expira) {
        Alert.alert(
          'Erro',
          'Código expirado.'
        );
        return;
      }

      const atualizarUsuario = await supabase
        .from('usuarios')
        .update({
          senha: novaSenha,
        })
        .eq('cpf', cpf);

      if (atualizarUsuario.error) {
        Alert.alert(
          'Erro',
          atualizarUsuario.error.message
        );
        return;
      }

      await supabase
        .from('recuperacao_senha')
        .update({
          utilizado: true,
        })
        .eq('id', recuperacao.data.id);

      Alert.alert(
        'Sucesso',
        'Senha alterada com sucesso.'
      );

      router.replace('/login');

    } catch (erro: any) {
      Alert.alert(
        'Erro',
        erro.message
      );
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Validar Código
      </Text>

      <TextInput
        style={styles.input}
        placeholder="CPF"
        placeholderTextColor="#999"
        value={cpf}
        onChangeText={setCpf}
      />

      <TextInput
        style={styles.input}
        placeholder="Código recebido"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={codigo}
        onChangeText={setCodigo}
      />

      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <Text style={styles.regraSenha}>
        A senha deve conter:
        {'\n'}• Mínimo 8 caracteres
        {'\n'}• 1 letra maiúscula
        {'\n'}• 1 número
        {'\n'}• 1 caractere especial
      </Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={alterarSenha}
      >
        <Text style={styles.botaoTexto}>
          ALTERAR SENHA
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

  titulo: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    backgroundColor: '#FFF',
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  regraSenha: {
    color: '#FFF',
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 20,
  },

  botao: {
    backgroundColor: '#F5B800',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoTexto: {
    color: '#02153D',
    fontSize: 18,
    fontWeight: 'bold',
  },
});