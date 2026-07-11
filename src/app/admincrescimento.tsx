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

export default function AdminCrescimentoScreen() {

  const [dias, setDias] =
    useState<any[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {

    try {

      const { data: usuarios } =
        await supabase
          .from('usuarios')
          .select(
            'created_at'
          );

      const { data: assinaturas } =
        await supabase
          .from('assinaturas')
          .select(
            'created_at, valor_pago'
          );

      const agrupado: any = {};

      (usuarios || []).forEach(
        (usuario) => {

          const data =
            new Date(
              usuario.created_at
            ).toLocaleDateString(
              'pt-BR'
            );

          if (!agrupado[data]) {

            agrupado[data] = {
              data,
              usuarios: 0,
              assinaturas: 0,
              receita: 0,
            };
          }

          agrupado[data]
            .usuarios += 1;
        }
      );

      (assinaturas || []).forEach(
        (assinatura) => {

          const data =
            new Date(
              assinatura.created_at
            ).toLocaleDateString(
              'pt-BR'
            );

          if (!agrupado[data]) {

            agrupado[data] = {
              data,
              usuarios: 0,
              assinaturas: 0,
              receita: 0,
            };
          }

          agrupado[data]
            .assinaturas += 1;

          agrupado[data]
            .receita += Number(
              assinatura.valor_pago || 0
            );
        }
      );

      const lista =
        Object.values(
          agrupado
        ).sort(
          (
            a: any,
            b: any
          ) =>
            new Date(
              b.data.split('/').reverse().join('-')
            ).getTime()
            -
            new Date(
              a.data.split('/').reverse().join('-')
            ).getTime()
        );

      setDias(lista);

    } catch (erro) {

      logger.log(
        erro
      );
    }
  }

  return (

    <SafeAreaView
      style={styles.container}
    >

      <View
        style={styles.header}
      >

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

        <Text
          style={styles.titulo}
        >
          Crescimento
        </Text>

        <View
          style={{
            width: 32,
          }}
        />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {dias.map(
          (
            dia,
            index
          ) => (

            <View
              key={index}
              style={styles.card}
            >

              <Text
                style={styles.data}
              >
                {dia.data}
              </Text>

              <Text
                style={styles.info}
              >
                👤 Usuários:
                {' '}
                {dia.usuarios}
              </Text>

              <Text
                style={styles.info}
              >
                ⭐ Assinaturas:
                {' '}
                {dia.assinaturas}
              </Text>

              <Text
                style={styles.receita}
              >
                💰 Receita:
                {' '}
                R$
                {' '}
                {dia.receita.toFixed(
                  2
                )}
              </Text>

            </View>
          )
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
      alignItems:
        'center',
      marginTop: 10,
      marginBottom: 20,
    },

    titulo: {
      color: '#FFF',
      fontSize: 24,
      fontWeight:
        'bold',
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

    data: {
      color: '#F5B800',
      fontSize: 20,
      fontWeight:
        'bold',
      marginBottom: 10,
    },

    info: {
      color: '#FFF',
      fontSize: 16,
      marginBottom: 5,
    },

    receita: {
      color: '#39D353',
      fontSize: 18,
      fontWeight:
        'bold',
      marginTop: 10,
    },

  });
