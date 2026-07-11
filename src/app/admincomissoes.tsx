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

export default function AdminComissoesScreen() {

  const [comissoes, setComissoes] =
    useState<any[]>([]);

  const [totalBloqueado, setTotalBloqueado] =
    useState(0);

  const [totalLiberado, setTotalLiberado] =
    useState(0);

  useEffect(() => {
    carregarComissoes();
  }, []);

  async function carregarComissoes() {

    try {

      const { data, error } =
        await supabase
          .from('comissoes')
          .select('*')
          .order(
            'data_liberacao',
            { ascending: false }
          );

      if (error) {
        logger.log(error);
        return;
      }

      const lista =
        await Promise.all(

          (data || []).map(
            async (comissao) => {

              const { data: afiliado } =
                await supabase
                  .from('afiliados')
                  .select(
                    'usuario_id, codigo_afiliado'
                  )
                  .eq(
                    'usuario_id',
                    comissao.afiliado_id
                  )
                  .maybeSingle();

              let nome =
                'Afiliado';

              if (
                afiliado?.usuario_id
              ) {

                const {
                  data: usuario,
                } = await supabase
                  .from('usuarios')
                  .select('nome')
                  .eq(
                    'id',
                    afiliado.usuario_id
                  )
                  .single();

                nome =
                  usuario?.nome ||
                  'Afiliado';
              }

              return {
                ...comissao,
                nome,
                codigo:
                  afiliado?.codigo_afiliado ||
                  '-',
              };
            }
          )
        );

      const bloqueado =
        lista
          .filter(
            item =>
              item.status ===
              'bloqueado'
          )
          .reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.valor || 0
              ),
            0
          );

      const liberado =
        lista
          .filter(
            item =>
              item.status ===
              'liberado'
          )
          .reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.valor || 0
              ),
            0
          );

      setTotalBloqueado(
        bloqueado
      );

      setTotalLiberado(
        liberado
      );

      setComissoes(
        lista
      );

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
          Comissões
        </Text>

        <View
          style={{
            width: 32,
          }}
        />

      </View>

      <View
        style={styles.resumo}
      >

        <Text
          style={styles.resumoTexto}
        >
          Liberado:
          R$
          {' '}
          {totalLiberado.toFixed(
            2
          )}
        </Text>

        <Text
          style={styles.resumoTexto}
        >
          Bloqueado:
          R$
          {' '}
          {totalBloqueado.toFixed(
            2
          )}
        </Text>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {comissoes.map(
          (
            item
          ) => (

            <View
              key={item.id}
              style={
                styles.card
              }
            >

              <Text
                style={
                  styles.nome
                }
              >
                {item.nome}
              </Text>

              <Text
                style={
                  styles.info
                }
              >
                Código:
                {' '}
                {item.codigo}
              </Text>

              <Text
                style={
                  styles.info
                }
              >
                Comissão:
                {' '}
                {item.percentual}%
              </Text>

              <Text
                style={
                  styles.valor
                }
              >
                R$
                {' '}
                {Number(
                  item.valor
                ).toFixed(2)}
              </Text>

              <View
                style={
                  item.status ===
                  'liberado'
                    ? styles.liberado
                    : styles.bloqueado
                }
              >

                <Text
                  style={
                    styles.statusTexto
                  }
                >
                  {item.status.toUpperCase()}
                </Text>

              </View>

              <Text
                style={
                  styles.data
                }
              >
                Liberação:
                {' '}
                {new Date(
                  item.data_liberacao
                ).toLocaleDateString(
                  'pt-BR'
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

    resumo: {
      backgroundColor:
        '#14396E',
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
    },

    resumoTexto: {
      color: '#FFF',
      fontSize: 16,
      fontWeight:
        'bold',
      marginBottom: 5,
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

    nome: {
      color: '#F5B800',
      fontSize: 20,
      fontWeight:
        'bold',
      marginBottom: 10,
    },

    info: {
      color: '#FFF',
      marginBottom: 5,
    },

    valor: {
      color: '#39D353',
      fontSize: 24,
      fontWeight:
        'bold',
      marginTop: 10,
    },

    liberado: {
      backgroundColor:
        '#39D353',
      alignSelf:
        'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      marginTop: 10,
    },

    bloqueado: {
      backgroundColor:
        '#F5B800',
      alignSelf:
        'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      marginTop: 10,
    },

    statusTexto: {
      color: '#000',
      fontWeight:
        'bold',
    },

    data: {
      color: '#FFF',
      marginTop: 10,
    },

  });
