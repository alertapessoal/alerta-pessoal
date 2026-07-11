import { logger } from '../lib/logger';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { api } from '../lib/api';

export default function NotificacoesScreen() {
  const [push, setPush] = useState(true);
  const [sonora, setSonora] = useState(true);
  const [vibracao, setVibracao] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  async function carregarConfiguracoes() {
    try {
      const data = await api.get('/usuario/notificacoes');
      if (data) {
        setPush(data.push ?? true);
        setSonora(data.sonora ?? true);
        setVibracao(data.vibracao ?? true);
      }
    } catch (erro) {
      // Se não conseguir carregar, mantém os valores padrão
      logger.log(erro);
    }
  }

  async function salvarConfiguracoes() {
    try {
      setSalvando(true);

      await api.post('/usuario/notificacoes', {
        push,
        sonora,
        vibracao,
      });

      Alert.alert('Sucesso', 'Configurações salvas com sucesso!');

    } catch (erro: any) {
      const mensagem =
        erro?.response?.data?.erro ||
        erro?.message ||
        'Erro ao salvar configurações. Tente novamente.';
      Alert.alert('Erro', mensagem);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={32}
            color="#FFF"
          />
        </TouchableOpacity>

        <Text style={styles.titulo}>
          Notificações
        </Text>

        <View style={{ width: 32 }} />
      </View>

      <Text style={styles.subtitulo}>
        Configure como deseja receber os alertas.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.card}>

          <Text style={styles.cardTitulo}>
            Recebimento de alertas
          </Text>

          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitulo}>
                Notificação push
              </Text>
              <Text style={styles.itemDescricao}>
                Receber alertas diretamente no celular.
              </Text>
            </View>

            <Switch
              value={push}
              onValueChange={setPush}
            />
          </View>

          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitulo}>
                Notificação sonora
              </Text>
              <Text style={styles.itemDescricao}>
                Reproduzir som ao receber alertas.
              </Text>
            </View>

            <Switch
              value={sonora}
              onValueChange={setSonora}
            />
          </View>

          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitulo}>
                Vibração
              </Text>
              <Text style={styles.itemDescricao}>
                Vibrar o aparelho ao receber alertas.
              </Text>
            </View>

            <Switch
              value={vibracao}
              onValueChange={setVibracao}
            />
          </View>

        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitulo}>
            Alertas disponíveis
          </Text>

          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitulo}>
                Mandado de prisão
              </Text>

              <Text style={styles.itemDescricao}>
                Notificar quando for identificado mandado vinculado ao CPF.
              </Text>
            </View>

            <View style={styles.bolinhaAtivaContainer}>
              <View style={styles.bolinhaAtiva} />
            </View>
          </View>

        </View>

        <TouchableOpacity
          style={[styles.botao, salvando && styles.botaoDesabilitado]}
          onPress={salvarConfiguracoes}
          disabled={salvando}
        >
          <Text style={styles.botaoTexto}>
            {salvando ? 'SALVANDO...' : 'SALVAR CONFIGURAÇÕES'}
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  titulo: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitulo: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },

  card: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },

  cardTitulo: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  itemTitulo: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  itemDescricao: {
    color: '#D0D0D0',
    fontSize: 14,
    maxWidth: 240,
  },

  bolinhaAtivaContainer: {
    width: 51,
    alignItems: 'center',
  },

  bolinhaAtiva: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#39D353',
  },

  botao: {
    backgroundColor: '#F5B800',
    borderRadius: 15,
    padding: 18,
    marginTop: 10,
    marginBottom: 30,
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  botaoTexto: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#031B4E',
  },

});

