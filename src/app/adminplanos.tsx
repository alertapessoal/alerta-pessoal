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

import { supabase } from '../lib/supabase';

export default function AdminPlanosScreen() {

  const [planos, setPlanos] =
    useState<any[]>([]);

  const [totalReceita, setTotalReceita] =
    useState(0);

  const [totalAssinaturas, setTotalAssinaturas] =
    useState(0);

  useEffect(() => {
    carregarPlanos();
  }, []);

  async function carregarPlanos() {

    try {

      const { data: planosData } =
        await supabase
          .from('planos')
          .select('*');

      const { data: assinaturas } =
        await supabase
          .from('assinaturas')
          .select('*')
          .eq('status', 'ativo');

      if (!planosData) return;

      const lista = planosData.map(
        (plano) => {

          const assinaturasPlano =
            (assinaturas || []).filter(
              (item) =>
                item.plano_id === plano.id
            );

          const receita =
            assinaturasPlano.reduce(
              (total, item) =>
                total +
                Number(
                  item.valor_pago || 0
                ),
              0
            );

          return {
            ...plano,
            quantidade:
              assinaturasPlano.length,
            receita,
          };
        }
      );

      const receitaTotal =
        lista.reduce(
          (total, plano) =>
            total + plano.receita,
          0
        );

      const totalAss =
        lista.reduce(
          (total, plano) =>
            total + plano.quantidade,
          0
        );

      setPlanos(lista);
      setTotalReceita(
        receitaTotal
      );
      setTotalAssinaturas(
        totalAss
      );

    } catch (erro) {
      console.log(erro);
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={32}
            color="#FFF"
          />
        </TouchableOpacity>

        <Text style={styles.titulo}>
          Receita por Plano
        </Text>

        <View style={{ width: 32 }} />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {planos.map(
          (plano) => (

            <View
              key={plano.id}
              style={styles.card}
            >

              <Text style={styles.nome}>
                {plano.nome}
              </Text>

              <Text style={styles.info}>
                Assinaturas:
                {' '}
                {plano.quantidade}
              </Text>

              <Text style={styles.info}>
                Valor Plano:
                {' '}
                R$
                {' '}
                {Number(
                  plano.valor
                ).toFixed(2)}
              </Text>

              <Text style={styles.receita}>
                Receita:
                {' '}
                R$
                {' '}
                {plano.receita.toFixed(2)}
              </Text>

            </View>
          )
        )}

        <View
          style={styles.totalCard}
        >

          <Text style={styles.totalTitulo}>
            TOTAL GERAL
          </Text>

          <Text style={styles.totalTexto}>
            Assinaturas:
            {' '}
            {totalAssinaturas}
          </Text>

          <Text style={styles.totalValor}>
            R$
            {' '}
            {totalReceita.toFixed(2)}
          </Text>

        </View>

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
    justifyContent:
      'space-between',
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
    backgroundColor: '#14396E',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1F6FE5',
  },

  nome: {
    color: '#F5B800',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  info: {
    color: '#FFF',
    fontSize: 15,
    marginBottom: 5,
  },

  receita: {
    color: '#39D353',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },

  totalCard: {
    backgroundColor: '#157A2C',
    borderRadius: 18,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
  },

  totalTitulo: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  totalTexto: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
  },

  totalValor: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },

});