import { logger } from '../lib/logger';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { api } from '../lib/api';

export default function SaquesHistoricoScreen() {

  const [saques, setSaques] = useState<any[]>([]);

  useEffect(() => {
    carregarSaques();
  }, []);

  async function carregarSaques() {
    try {
      const data = await api.get('/saque/historico');
      setSaques(data || []);
    } catch (erro) {
      logger.log(erro);
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={32} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.titulo}>Histórico de Saques</Text>

        <View style={{ width: 32 }} />

      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {saques.length === 0 && (
          <View style={styles.card}>
            <Text style={styles.semDados}>
              Nenhum saque encontrado.
            </Text>
          </View>
        )}

        {saques.map((saque) => (
          <View
            key={saque.id}
            style={[
              styles.card,
              saque.status === 'aprovado'
                ? styles.cardAprovado
                : saque.status === 'recusado'
                ? styles.cardRecusado
                : styles.cardPendente,
            ]}
          >

            <Text style={styles.valor}>
              R$ {Number(saque.valor).toFixed(2)}
            </Text>

            <Text style={styles.label}>Data:</Text>
            <Text style={styles.data}>
              {new Date(saque.data_solicitacao).toLocaleDateString('pt-BR')}
            </Text>

            <Text style={styles.label}>Chave PIX:</Text>
            <Text style={styles.data}>{saque.chave_pix}</Text>

            <Text style={styles.label}>Status:</Text>
            <View
              style={
                saque.status === 'aprovado'
                  ? styles.pago
                  : saque.status === 'recusado'
                  ? styles.recusado
                  : styles.pendente
              }
            >
              <Text style={styles.statusTexto}>
                {saque.status.toUpperCase()}
              </Text>
            </View>

            {saque.status === 'aprovado' && saque.data_pagamento && (
              <>
                <Text style={styles.label}>Pago em:</Text>
                <Text style={styles.data}>
                  {new Date(saque.data_pagamento).toLocaleDateString('pt-BR')}
                </Text>
              </>
            )}

          </View>
        ))}

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
    fontSize: 24,
    fontWeight: 'bold',
  },

  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    borderWidth: 2,
  },

  cardAprovado: {
    backgroundColor: '#157A2C',
    borderColor: '#2EAF48',
  },

  cardRecusado: {
    backgroundColor: '#8B0000',
    borderColor: '#FF3B30',
  },

  cardPendente: {
    backgroundColor: '#B8860B',
    borderColor: '#F5B800',
  },

  valor: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  label: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 12,
  },

  data: {
    color: '#FFF',
    marginTop: 4,
    fontSize: 15,
  },

  pendente: {
    backgroundColor: '#F5B800',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 12,
  },

  pago: {
    backgroundColor: '#39D353',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 12,
  },

  recusado: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 12,
  },

  statusTexto: {
    color: '#000',
    fontWeight: 'bold',
  },

  semDados: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
  },

});

