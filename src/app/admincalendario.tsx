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

export default function AdminCalendarioScreen() {

  const [datas, setDatas] =
    useState<any[]>([]);

  useEffect(() => {
    carregarCalendario();
  }, []);

  async function carregarCalendario() {

    try {

      const { data } =
        await supabase
          .from('comissoes')
          .select('*')
          .eq(
            'status',
            'bloqueado'
          )
          .order(
            'data_liberacao',
            { ascending: true }
          );

      if (!data) return;

      const agrupado: any = {};

      data.forEach((item) => {

        const dataFormatada =
          new Date(
            item.data_liberacao
          ).toLocaleDateString(
            'pt-BR'
          );

        if (
          !agrupado[
            dataFormatada
          ]
        ) {

          agrupado[
            dataFormatada
          ] = {

            data:
              dataFormatada,

            quantidade: 0,

            valor: 0,
          };
        }

        agrupado[
          dataFormatada
        ].quantidade += 1;

        agrupado[
          dataFormatada
        ].valor += Number(
          item.valor || 0
        );
      });

      setDatas(
        Object.values(
          agrupado
        )
      );

    } catch (erro) {
      console.log(erro);
    }
  }

  return (

    <SafeAreaView
      style={
        styles.container
      }
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
          style={
            styles.titulo
          }
        >
          Calendário
        </Text>

        <View
          style={{
            width: 32,
          }}
        />

      </View>

      <ScrollView>

        {datas.map(
          (
            item,
            index
          ) => (

            <View
              key={index}
              style={
                styles.card
              }
            >

              <Text
                style={
                  styles.data
                }
              >
                {item.data}
              </Text>

              <Text
                style={
                  styles.info
                }
              >
                Comissões:
                {' '}
                {
                  item.quantidade
                }
              </Text>

              <Text
                style={
                  styles.valor
                }
              >
                R$
                {' '}
                {
                  item.valor.toFixed(
                    2
                  )
                }
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
      flexDirection:
        'row',
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

    valor: {
      color: '#39D353',
      fontSize: 22,
      fontWeight:
        'bold',
    },

  });