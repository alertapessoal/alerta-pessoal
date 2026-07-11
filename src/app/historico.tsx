import { logger } from '../lib/logger';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomMenu from '../components/BottomMenu';
import { api } from '../lib/api';

export default function HistoricoScreen() {

  const [consultas, setConsultas] =
    useState<any[]>([]);

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {

    try {

      const data = await api.get('/historico');

      setConsultas(data || []);

    } catch (erro) {

      logger.log(erro);

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
          Histórico
        </Text>

        <Ionicons
          name="filter-outline"
          size={32}
          color="#FFF"
        />

      </View>

      <Text style={styles.subtitulo}>
        Todas as verificações realizadas no seu CPF.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {consultas.length === 0 && (

          <View style={styles.card}>

            <Text style={styles.texto}>
              Nenhuma consulta encontrada.
            </Text>

          </View>

        )}

        {consultas.map(
          (
            consulta,
            index
          ) => {

            const resultado =
              (
                consulta.resultado || ''
              ).toUpperCase();

            const ehMandado =
              resultado.includes(
                'MANDADO'
              );

            return (

              <View
                key={index}
                style={styles.card}
              >

                <View
                  style={
                    ehMandado
                      ? styles.iconRed
                      : styles.iconGreen
                  }
                >

                  <Ionicons
                    name={
                      ehMandado
                        ? 'alert'
                        : 'checkmark'
                    }
                    size={40}
                    color="#FFF"
                  />

                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >

                  <Text
                    style={
                      ehMandado
                        ? styles.red
                        : styles.green
                    }
                  >
                    {resultado}
                  </Text>

                  <Text style={styles.texto}>
                    Verificação automática
                  </Text>

                  <Text style={styles.data}>
                    {new Date(
                      consulta.data_consulta
                    ).toLocaleString(
                      'pt-BR'
                    )}
                  </Text>

                </View>

              </View>

            );

          }
        )}

      </ScrollView>

      <BottomMenu />

    </SafeAreaView>
  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#031B4E',
    padding: 9,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 5,
  },

  titulo: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
  },

  subtitulo: {
    color: '#FFF',
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 6,
  },

  card: {
    flexDirection: 'row',
    gap: 15,
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },

  iconGreen: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2EAF48',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconRed: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D62828',
    justifyContent: 'center',
    alignItems: 'center',
  },

  green: {
    color: '#39D353',
    fontSize: 22,
    fontWeight: 'bold',
  },

  red: {
    color: '#FF3B3B',
    fontSize: 18,
    fontWeight: 'bold',
  },

  texto: {
    color: '#FFF',
    marginTop: 5,
  },

  data: {
    color: '#FFF',
    marginTop: 5,
    fontWeight: 'bold',
  },

});

