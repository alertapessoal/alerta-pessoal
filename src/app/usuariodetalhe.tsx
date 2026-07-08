import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';

export default function UsuarioDetalheScreen() {

  const { usuarioId } =
    useLocalSearchParams();

  const [usuario, setUsuario] =
    useState<any>(null);

  const [afiliado, setAfiliado] =
    useState<any>(null);

  const [assinatura, setAssinatura] =
    useState<any>(null);

  const [saques, setSaques] =
    useState<any[]>([]);

  const [comissoes, setComissoes] =
    useState<any[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {

    try {

      const {
        data: usuarioData,
      } = await supabase
        .from('usuarios')
        .select('*')
        .eq(
          'id',
          usuarioId
        )
        .single();

      setUsuario(
        usuarioData
      );

      const {
        data: afiliadoData,
      } = await supabase
        .from('afiliados')
        .select('*')
        .eq(
          'usuario_id',
          usuarioId
        )
        .maybeSingle();

      setAfiliado(
        afiliadoData
      );

      const {
        data: assinaturaData,
      } = await supabase
        .from('assinaturas')
        .select(`
          *,
          planos(*)
        `)
        .eq(
          'usuario_id',
          usuarioId
        )
        .eq(
          'status',
          'ativo'
        )
        .maybeSingle();

      setAssinatura(
        assinaturaData
      );

      const {
        data: saquesData,
      } = await supabase
        .from('saques')
        .select('*')
        .eq(
          'usuario_id',
          usuarioId
        )
        .order(
          'data_solicitacao',
          {
            ascending: false,
          }
        );

      setSaques(
        saquesData || []
      );

      const {
        data: comissoesData,
      } = await supabase
        .from('comissoes')
        .select('*')
        .eq(
          'afiliado_id',
          usuarioId
        )
        .order(
          'data_liberacao',
          {
            ascending: false,
          }
        );

      setComissoes(
        comissoesData || []
      );

    } catch (erro) {

      console.log(
        erro
      );
    }
  }

  if (!usuario) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <Text
          style={{
            color: '#FFF',
          }}
        >
          Carregando...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
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
        Detalhes do Usuário
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.card}>

          <Text
            style={styles.nome}
          >
            {usuario.nome}
          </Text>

          <Text
            style={styles.info}
          >
            CPF: {usuario.cpf}
          </Text>

          <Text
            style={styles.info}
          >
            Email:
            {' '}
            {usuario.email}
          </Text>

          <Text
            style={styles.info}
          >
            Telefone:
            {' '}
            {usuario.telefone}
          </Text>

          <Text
            style={styles.info}
          >
            Cadastro:
            {' '}
            {new Date(
              usuario.created_at
            ).toLocaleDateString(
              'pt-BR'
            )}
          </Text>

        </View>

        <View style={styles.card}>

          <Text
            style={styles.subtitulo}
          >
            Plano Atual
          </Text>

          <Text
            style={styles.info}
          >
            {
              assinatura?.planos
                ?.nome ||
              'Gratuito'
            }
          </Text>

        </View>

        <View style={styles.card}>

          <Text
            style={styles.subtitulo}
          >
            Programa de Afiliados
          </Text>

          <Text
            style={styles.info}
          >
            Código:
            {' '}
            {
              afiliado?.codigo_afiliado ||
              '-'
            }
          </Text>

          <Text
            style={styles.info}
          >
            Indicados:
            {' '}
            {
              afiliado?.total_indicados ||
              0
            }
          </Text>

          <Text
            style={styles.info}
          >
            Disponível:
            R$
            {' '}
            {Number(
              afiliado?.saldo_disponivel || 0
            ).toFixed(2)}
          </Text>

          <Text
            style={styles.info}
          >
            Bloqueado:
            R$
            {' '}
            {Number(
              afiliado?.saldo_bloqueado || 0
            ).toFixed(2)}
          </Text>

        </View>

        <View style={styles.card}>

          <Text
            style={styles.subtitulo}
          >
            Histórico de Comissões
          </Text>

          {comissoes.map(
            (
              item
            ) => (

              <Text
                key={item.id}
                style={
                  styles.info
                }
              >
                R$
                {' '}
                {Number(
                  item.valor
                ).toFixed(2)}
                {' - '}
                {
                  item.status
                }
              </Text>
            )
          )}

        </View>

        <View style={styles.card}>

          <Text
            style={styles.subtitulo}
          >
            Histórico de Saques
          </Text>

          {saques.map(
            (
              item
            ) => (

              <Text
                key={item.id}
                style={
                  styles.info
                }
              >
                R$
                {' '}
                {Number(
                  item.valor
                ).toFixed(2)}
                {' - '}
                {
                  item.status
                }
              </Text>
            )
          )}

        </View>

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

    titulo: {
      color: '#FFF',
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 20,
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
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
    },

    subtitulo: {
      color: '#39D353',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },

    info: {
      color: '#FFF',
      marginBottom: 6,
      fontSize: 15,
    },

  });