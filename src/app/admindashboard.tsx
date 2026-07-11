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

export default function AdminDashboardScreen() {

  const [usuarios, setUsuarios] =
    useState(0);

  const [assinaturasAtivas, setAssinaturasAtivas] =
    useState(0);

  const [receitaTotal, setReceitaTotal] =
    useState(0);

  const [comissaoBloqueada, setComissaoBloqueada] =
    useState(0);

  const [comissaoLiberada, setComissaoLiberada] =
    useState(0);

  useEffect(() => {
    carregarDashboard();
  }, []);

  async function carregarDashboard() {

    try {

      const { count: totalUsuarios } =
        await supabase
          .from('usuarios')
          .select('*', {
            count: 'exact',
            head: true,
          });

      setUsuarios(
        totalUsuarios || 0
      );

      const {
        count: totalAssinaturas,
      } = await supabase
        .from('assinaturas')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('status', 'ativo');

      setAssinaturasAtivas(
        totalAssinaturas || 0
      );

      const {
        data: assinaturas,
      } = await supabase
        .from('assinaturas')
        .select('valor_pago')
        .eq('status', 'ativo');

      const totalReceita =
        (assinaturas || []).reduce(
          (total, item) =>
            total +
            Number(
              item.valor_pago || 0
            ),
          0
        );

      setReceitaTotal(
        totalReceita
      );

      const {
        data: bloqueadas,
      } = await supabase
        .from('comissoes')
        .select('valor')
        .eq(
          'status',
          'bloqueado'
        );

      const totalBloqueado =
        (bloqueadas || []).reduce(
          (total, item) =>
            total +
            Number(
              item.valor || 0
            ),
          0
        );

      setComissaoBloqueada(
        totalBloqueado
      );

      const {
        data: liberadas,
      } = await supabase
        .from('comissoes')
        .select('valor')
        .eq(
          'status',
          'liberado'
        );

      const totalLiberado =
        (liberadas || []).reduce(
          (total, item) =>
            total +
            Number(
              item.valor || 0
            ),
          0
        );

      setComissaoLiberada(
        totalLiberado
      );

    } catch (erro) {
      logger.log(erro);
    }
  }

  return (
    <SafeAreaView style={styles.container}>

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
        Dashboard Administrativo
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.cardAzul}>
          <Text style={styles.label}>
            Usuários Cadastrados
          </Text>

          <Text style={styles.valor}>
            {usuarios}
          </Text>
        </View>

        <View style={styles.cardVerde}>
          <Text style={styles.label}>
            Receita Total
          </Text>

          <Text style={styles.valor}>
            R$ {receitaTotal.toFixed(2)}
          </Text>
        </View>

        <View style={styles.cardAmarelo}>
          <Text style={styles.label}>
            Comissões Bloqueadas
          </Text>

          <Text style={styles.valor}>
            R$ {comissaoBloqueada.toFixed(2)}
          </Text>
        </View>

        <View style={styles.cardRoxo}>
          <Text style={styles.label}>
            Comissões Liberadas
          </Text>

          <Text style={styles.valor}>
            R$ {comissaoLiberada.toFixed(2)}
          </Text>
        </View>

        <View style={styles.cardVermelho}>
          <Text style={styles.label}>
            Assinaturas Ativas
          </Text>

          <Text style={styles.valor}>
            {assinaturasAtivas}
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

  cardAzul: {
    backgroundColor: '#003E8A',
    borderColor: '#1F6FE5',
    borderWidth: 2,
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },

  cardVerde: {
    backgroundColor: '#157A2C',
    borderColor: '#2EAF48',
    borderWidth: 2,
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },

  cardAmarelo: {
    backgroundColor: '#B8860B',
    borderColor: '#F5B800',
    borderWidth: 2,
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },

  cardRoxo: {
    backgroundColor: '#700372',
    borderColor: '#ff30fc',
    borderWidth: 2,
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },

  cardVermelho: {
    backgroundColor: '#8B0000',
    borderColor: '#FF3B30',
    borderWidth: 2,
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },

  label: {
    color: '#FFF',
    fontSize: 16,
  },

  valor: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },

});
