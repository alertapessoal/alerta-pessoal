import { logger } from '../lib/logger';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../lib/api';

export default function AlertasScreen() {

  const [alertas, setAlertas] =
    useState<any[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [confirmandoId, setConfirmandoId] =
    useState<string | null>(null);

  useEffect(() => {
    carregarAlertas();
  }, []);

  async function carregarAlertas() {

    try {

      setCarregando(true);

      const dados = await api.get('/alerta/pendentes');

      setAlertas(dados || []);

    } catch (erro) {

      logger.log(erro);

    } finally {

      setCarregando(false);

    }

  }

  async function confirmarAlerta(id: string) {

    try {

      setConfirmandoId(id);

      await api.post(`/alerta/confirmar/${id}`, {});

      setAlertas(

        (atual) => atual.filter(

          (a) => a.id !== id

        )

      );

    } catch (erro) {

      logger.log(erro);

    } finally {

      setConfirmandoId(null);

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
            size={28}
            color="#FFF"
          />
        </TouchableOpacity>

        <Text style={styles.titulo}>
          Alertas
        </Text>
      </View>

      {carregando ? (

        <ActivityIndicator
          color="#F5B800"
          size="large"
          style={{ marginTop: 40 }}
        />

      ) : alertas.length === 0 ? (

        <View style={styles.vazio}>
          <Ionicons
            name="checkmark-circle"
            size={60}
            color="#39D353"
          />

          <Text style={styles.vazioTexto}>
            Nenhum alerta pendente.
          </Text>
        </View>

      ) : (

        <FlatList
          data={alertas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons
                  name="warning"
                  size={24}
                  color="#FF5C5C"
                />

                <Text style={styles.cardTitulo}>
                  {item.titulo}
                </Text>
              </View>

              <Text style={styles.cardDescricao}>
                {item.descricao}
              </Text>

              <TouchableOpacity
                style={styles.botaoCiente}
                disabled={confirmandoId === item.id}
                onPress={() => confirmarAlerta(item.id)}
              >
                {confirmandoId === item.id ? (

                  <ActivityIndicator color="#031B4E" />

                ) : (

                  <Text style={styles.botaoCienteTexto}>
                    ESTOU CIENTE
                  </Text>

                )}
              </TouchableOpacity>
            </View>

          )}
        />

      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031B4E',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 20,
  },

  titulo: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },

  vazioTexto: {
    color: '#FFF',
    fontSize: 16,
  },

  card: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },

  cardTitulo: {
    color: '#FF5C5C',
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
  },

  cardDescricao: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 15,
  },

  botaoCiente: {
    backgroundColor: '#F5B800',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },

  botaoCienteTexto: {
    color: '#031B4E',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

