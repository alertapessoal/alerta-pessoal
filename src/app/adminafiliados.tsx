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

export default function AdminAfiliadosScreen() {

  const [afiliados, setAfiliados] =
    useState<any[]>([]);

  useEffect(() => {
    carregarAfiliados();
  }, []);

  async function carregarAfiliados() {

    try {

      const { data, error } =
        await supabase
          .from('afiliados')
          .select('*')
          .order(
            'total_indicados',
            { ascending: false }
          );

      if (error) {
        console.log(error);
        return;
      }

      const listaCompleta =
        await Promise.all(

          (data || []).map(
            async (afiliado) => {

              const { data: usuario } =
                await supabase
                  .from('usuarios')
                  .select('nome')
                  .eq(
                    'id',
                    afiliado.usuario_id
                  )
                  .single();

              return {
                ...afiliado,
                nome:
                  usuario?.nome ||
                  'Sem nome',
              };
            }
          )
        );

      setAfiliados(
        listaCompleta
      );

    } catch (erro) {
      console.log(erro);
    }
  }

  function medalha(
    posicao: number
  ) {

    if (posicao === 0) {
      return '🥇';
    }

    if (posicao === 1) {
      return '🥈';
    }

    if (posicao === 2) {
      return '🥉';
    }

    return `#${posicao + 1}`;
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
          Ranking de Afiliados
        </Text>

        <View
          style={{ width: 32 }}
        />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {afiliados.map(
          (
            afiliado,
            index
          ) => {

            const totalGanho =
              Number(
                afiliado.saldo_disponivel || 0
              ) +
              Number(
                afiliado.saldo_bloqueado || 0
              );

            return (

              <View
                key={afiliado.id}
                style={styles.card}
              >

                <Text
                  style={styles.posicao}
                >
                  {medalha(index)}
                </Text>

                <Text
                  style={styles.nome}
                >
                  {afiliado.nome}
                </Text>

                <Text
                  style={styles.info}
                >
                  Código:
                  {' '}
                  {
                    afiliado.codigo_afiliado
                  }
                </Text>

                <Text
                  style={styles.info}
                >
                  Indicados:
                  {' '}
                  {
                    afiliado.total_indicados
                  }
                </Text>

                <Text
                  style={styles.info}
                >
                  Disponível:
                  {' '}
                  R$
                  {' '}
                  {Number(
                    afiliado.saldo_disponivel || 0
                  ).toFixed(2)}
                </Text>

                <Text
                  style={styles.info}
                >
                  Bloqueado:
                  {' '}
                  R$
                  {' '}
                  {Number(
                    afiliado.saldo_bloqueado || 0
                  ).toFixed(2)}
                </Text>

                <Text
                  style={styles.total}
                >
                  Total Ganho:
                  {' '}
                  R$
                  {' '}
                  {totalGanho.toFixed(2)}
                </Text>

              </View>
            );
          }
        )}

      </ScrollView>

    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        '#031B4E',
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
      backgroundColor:
        '#14396E',
      borderRadius: 18,
      padding: 18,
      marginBottom: 15,
      borderWidth: 1,
      borderColor:
        '#1F6FE5',
    },

    posicao: {
      fontSize: 28,
      marginBottom: 10,
    },

    nome: {
      color: '#F5B800',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },

    info: {
      color: '#FFF',
      fontSize: 15,
      marginBottom: 5,
    },

    total: {
      color: '#39D353',
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
    },

  });