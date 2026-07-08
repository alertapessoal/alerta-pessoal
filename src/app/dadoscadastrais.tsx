import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '../lib/api';

export default function DadosCadastraisScreen() {
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const carregarUsuario = async () => {
    try {
      const data = await api.get('/usuario/perfil');

      setId(data.id);
      setNome(data.nome);
      setCpf(data.cpf);
      setEmail(data.email);
      setTelefone(data.telefone);

    } catch (erro: any) {
      Alert.alert(
        'Erro',
        erro.message
      );
    }
  };

  const salvarAlteracoes = async () => {
    try {
      const data = await api.put('/usuario/perfil', {
        nome,
        email,
        telefone,
      });

      const usuarioAtualizado = {
        id: data.id,
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
        telefone: data.telefone,
      };

      await AsyncStorage.setItem(
        'usuarioLogado',
        JSON.stringify(
          usuarioAtualizado
        )
      );

      Alert.alert(
        'Sucesso',
        'Dados atualizados com sucesso.'
      );

    } catch (erro: any) {
      Alert.alert(
        'Erro',
        erro.message
      );
    }
  };
  
useEffect(() => {
  void carregarUsuario();
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={36}
            color="#FFF"
          />
        </TouchableOpacity>

        <Text style={styles.titulo}>
          Dados Cadastrais
        </Text>

        <Text style={styles.subtitulo}>
          Atualize suas informações pessoais.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>
            Informações Pessoais
          </Text>

          <Text style={styles.label}>
            Nome Completo
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={24}
              color="#FFF"
            />

            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Nome Completo"
              placeholderTextColor="#AAA"
            />
          </View>

          <Text style={styles.label}>
            CPF
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="card-outline"
              size={24}
              color="#FFF"
            />

            <TextInput
              style={styles.input}
              value={cpf}
              editable={false}
              placeholderTextColor="#AAA"
            />
          </View>

          <Text style={styles.label}>
            E-mail
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={24}
              color="#FFF"
            />

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="E-mail"
              placeholderTextColor="#AAA"
            />
          </View>

          <Text style={styles.label}>
            Celular
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={24}
              color="#FFF"
            />

            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={setTelefone}
              placeholder="Celular"
              placeholderTextColor="#AAA"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={salvarAlteracoes}
        >
          <Text style={styles.botaoTexto}>
            SALVAR ALTERAÇÕES
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031B4E',
    padding: 20,
  },

  titulo: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },

  subtitulo: {
    color: '#D9D9D9',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
  },

  card: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 20,
    padding: 20,
  },

  cardTitulo: {
    color: '#ded304',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  label: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
    marginTop: 15,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3D4D70',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
  },

  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 18,
    marginLeft: 12,
  },

  botao: {
    backgroundColor: '#F5B800',
    height: 65,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },

  botaoTexto: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
});