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

import { supabase } from '../lib/supabase';

export default function AdminFinanceiroScreen() {

  const [receita, setReceita] =
    useState(0);

  const [liberadas, setLiberadas] =
    useState(0);

  const [bloqueadas, setBloqueadas] =
    useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {

    try {

      const { data: assinaturas } =
        await supabase
          .from('assinaturas')
          .select('valor_pago')
          .eq('status', 'ativo');

      const receitaTotal =
        (assinaturas || []).reduce(
          (total, item) =>
            total +
            Number(
              item.valor_pago || 0
            ),
          0
        );

      setReceita(
        receitaTotal
      );

      const { data: liberado } =
        await supabase
          .from('comissoes')
          .select('valor')
          .eq(
            'status',
            'liberado'
          );

      const totalLiberado =
        (liberado || []).reduce(
          (total, item) =>
            total +
            Number(
              item.valor || 0
            ),
          0
        );

      setLiberadas(
        totalLiberado
      );

      const { data: bloqueado } =
        await supabase
          .from('comissoes')
          .select('valor')
          .eq(
            'status',
            'bloqueado'
          );

      const totalBloqueado =
        (bloqueado || []).reduce(
          (total, item) =>
            total +
            Number(
              item.valor || 0
            ),
          0
        );

      setBloqueadas(
        totalBloqueado
      );

    } catch (erro) {
      logger.log(erro);
    }
  }

  const lucroLiquido =
    receita -
    liberadas -
    bloqueadas;

  return (
    <SafeAreaView style={styles.container}>

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
        Fluxo Financeiro
      </Text>

      <ScrollView>

        <View style={styles.verde}>
          <Text style={styles.label}>
            Receita Total
          </Text>

          <Text style={styles.valor}>
            R$ {receita.toFixed(2)}
          </Text>
        </View>

        <View style={styles.roxo}>
          <Text style={styles.label}>
            Comissões Liberadas
          </Text>

          <Text style={styles.valor}>
            R$ {liberadas.toFixed(2)}
          </Text>
        </View>

        <View style={styles.amarelo}>
          <Text style={styles.label}>
            Comissões Bloqueadas
          </Text>

          <Text style={styles.valor}>
            R$ {bloqueadas.toFixed(2)}
          </Text>
        </View>

        <View style={styles.azul}>
          <Text style={styles.label}>
            Lucro Líquido Estimado
          </Text>

          <Text style={styles.valor}>
            R$ {lucroLiquido.toFixed(2)}
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

  titulo: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },

  verde: {
    backgroundColor: '#157A2C',
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },

  roxo: {
    backgroundColor: '#700372',
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },

  amarelo: {
    backgroundColor: '#B8860B',
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },

  azul: {
    backgroundColor: '#003E8A',
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },

  label: {
    color: '#FFF',
    fontSize: 18,
  },

  valor: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },

});
