import { logger } from '../lib/logger';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { api } from '../lib/api';

export default function ComissoesScreen() {
  const [comissoes, setComissoes] =
    useState<any[]>([]);

  useEffect(() => {
    carregarComissoes();
  }, []);

  async function carregarComissoes() {
    try {
      const data = await api.get('/comissao/minhas');
      setComissoes(data || []);
    } catch (erro) {
      logger.log(erro);
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={32}
            color="#FFF"
          />
        </TouchableOpacity>

        <Text style={styles.titulo}>
          Minhas Comissões
        </Text>

        <View style={{ width: 32 }} />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {comissoes.length === 0 && (
          <View style={styles.card}>
            <Text
              style={{
                color: '#FFF',
                textAlign: 'center',
              }}
            >
              Nenhuma comissão encontrada.
            </Text>
          </View>
        )}

        {comissoes.map(
          (comissao) => {

            const bloqueado =
              comissao.status === 'bloqueado';

            return (
              <View
                key={comissao.id}
                style={styles.card}
              >

                <Text style={styles.valor}>
                  R$ {Number(comissao.valor).toFixed(2)}
                </Text>

                <Text style={styles.indicado}>
                  Indicação: {comissao.primeiroNome || 'Usuário'}
                </Text>

                <Text style={styles.percentual}>
                  Comissão {Number(comissao.percentual)}%
                </Text>

                <View
                  style={
                    bloqueado
                      ? styles.statusBloqueado
                      : styles.statusLiberado
                  }
                >
                  <Text style={styles.statusTexto}>
                    {comissao.status.toUpperCase()}
                  </Text>
                </View>

                <Text style={styles.data}>
                  {bloqueado ? 'Liberação: ' : 'Liberado em: '}
                  {new Date(comissao.data_liberacao).toLocaleDateString('pt-BR')}
                </Text>

              </View>
            );
          }
        )}

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
    marginBottom: 20,
  },

  titulo: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  card: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },

  valor: {
    color: '#39D353',
    fontSize: 30,
    fontWeight: 'bold',
  },

  indicado: {
    color: '#F5B800',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
  },

  percentual: {
    color: '#FFF',
    fontSize: 18,
  },

  statusLiberado: {
    backgroundColor: '#39D353',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 12,
  },

  statusBloqueado: {
    backgroundColor: '#F5B800',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 12,
  },

  statusTexto: {
    color: '#000',
    fontWeight: 'bold',
  },

  data: {
    color: '#FFF',
    marginTop: 15,
    fontSize: 15,
  },

});

