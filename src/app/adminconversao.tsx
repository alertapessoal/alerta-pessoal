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

export default function AdminConversaoScreen() {

  const [dados, setDados] =
    useState<any[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {

    try {

      const { data: afiliados } =
        await supabase
          .from('afiliados')
          .select('*');

      if (!afiliados) return;

      const lista =
        await Promise.all(

          afiliados.map(
            async (afiliado) => {

              const { data: usuario } =
                await supabase
                  .from('usuarios')
                  .select(
                    'nome'
                  )
                  .eq(
                    'id',
                    afiliado.usuario_id
                  )
                  .single();

              const { data: indicados } =
                await supabase
                  .from('usuarios')
                  .select(
                    'id'
                  )
                  .eq(
                    'codigo_indicacao',
                    afiliado.codigo_afiliado
                  );

              const idsIndicados =
                (indicados || []).map(
                  (
                    item
                  ) => item.id
                );

              let assinaturasAtivas = 0;
              let receita = 0;

              if (
                idsIndicados.length > 0
              ) {

                const {
                  data: assinaturas,
                } = await supabase
                  .from(
                    'assinaturas'
                  )
                  .select(
                    'usuario_id, valor_pago'
                  )
                  .eq(
                    'status',
                    'ativo'
                  );

                (assinaturas || [])
                  .forEach(
                    (
                      assinatura
                    ) => {

                      if (
                        idsIndicados.includes(
                          assinatura.usuario_id
                        )
                      ) {

                        assinaturasAtivas++;

                        receita += Number(
                          assinatura.valor_pago || 0
                        );
                      }
                    }
                  );
              }

              const totalIndicados =
                afiliado.total_indicados || 0;

              const conversao =
                totalIndicados > 0
                  ? (
                      (assinaturasAtivas /
                        totalIndicados) *
                      100
                    ).toFixed(1)
                  : '0';

              return {

                nome:
                  usuario?.nome ||
                  'Sem nome',

                codigo:
                  afiliado.codigo_afiliado,

                indicados:
                  totalIndicados,

                assinaturas:
                  assinaturasAtivas,

                conversao,

                receita,
              };
            }
          )
        );

      lista.sort(
        (a, b) =>
          Number(
            b.conversao
          ) -
          Number(
            a.conversao
          )
      );

      setDados(lista);

    } catch (erro) {

      logger.log(
        erro
      );
    }
  }

  function medalha(
    index: number
  ) {

    if (index === 0)
      return '🥇';

    if (index === 1)
      return '🥈';

    if (index === 2)
      return '🥉';

    return `#${index + 1}`;
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
          Conversão
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

        {dados.map(
          (
            item,
            index
          ) => (

            <View
              key={index}
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
                {item.nome}
              </Text>

              <Text
                style={styles.info}
              >
                Código:
                {' '}
                {item.codigo}
              </Text>

              <Text
                style={styles.info}
              >
                Indicados:
                {' '}
                {item.indicados}
              </Text>

              <Text
                style={styles.info}
              >
                Assinaturas:
                {' '}
                {item.assinaturas}
              </Text>

              <Text
                style={styles.conversao}
              >
                Conversão:
                {' '}
                {item.conversao}%
              </Text>

              <Text
                style={styles.receita}
              >
                Receita:
                {' '}
                R$
                {' '}
                {item.receita.toFixed(
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

    posicao: {
      fontSize: 28,
      marginBottom: 10,
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
      fontSize: 15,
      marginBottom: 5,
    },

    conversao: {
      color: '#39D353',
      fontSize: 18,
      fontWeight:
        'bold',
      marginTop: 10,
    },

    receita: {
      color: '#FFF',
      fontSize: 18,
      fontWeight:
        'bold',
      marginTop: 5,
    },

  });
