import { logger } from '../lib/logger';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';

export default function AdminUsuariosScreen() {

  const [usuarios, setUsuarios] =
    useState<any[]>([]);

  const [filtro, setFiltro] =
    useState('');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {

    try {

      const { data, error } =
        await supabase
          .from('usuarios')
          .select('*')
          .order(
            'created_at',
            {
              ascending: false,
            }
          );

      if (error) {
        logger.log(error);
        return;
      }

      const lista =
        await Promise.all(

          (data || []).map(
            async (usuario) => {

              const {
                data: assinatura,
              } = await supabase
                .from('assinaturas')
                .select(`
                  *,
                  planos(*)
                `)
                .eq(
                  'usuario_id',
                  usuario.id
                )
                .eq(
                  'status',
                  'ativo'
                )
                .maybeSingle();

              return {

                ...usuario,

                plano:
                  assinatura?.planos?.nome ||
                  'Gratuito',
              };
            }
          )
        );

      setUsuarios(lista);

    } catch (erro) {

      logger.log(erro);
    }
  }

  const usuariosFiltrados =
    usuarios.filter(
      (usuario) =>
        usuario.nome
          ?.toLowerCase()
          .includes(
            filtro.toLowerCase()
          )
    );

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
          Usuários
        </Text>

        <View
          style={{
            width: 32,
          }}
        />

      </View>

      <TextInput
        style={styles.input}
        placeholder="Buscar usuário..."
        placeholderTextColor="#999"
        value={filtro}
        onChangeText={setFiltro}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {usuariosFiltrados.map(
          (usuario) => (

            <TouchableOpacity
              key={usuario.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname:
                    '/usuariodetalhe',
                  params: {
                    usuarioId:
                      usuario.id,
                  },
                })
              }
            >

              <Text
                style={styles.nome}
              >
                {usuario.nome}
              </Text>

              {usuario.admin && (

                <View
                  style={
                    styles.adminTag
                  }
                >
                  <Text
                    style={
                      styles.adminTexto
                    }
                  >
                    ADMIN
                  </Text>
                </View>

              )}

              <Text
                style={styles.info}
              >
                CPF:
                {' '}
                {usuario.cpf}
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
                style={styles.plano}
              >
                Plano:
                {' '}
                {usuario.plano}
              </Text>

              <Text
                style={styles.data}
              >
                Cadastro:
                {' '}
                {new Date(
                  usuario.created_at
                ).toLocaleDateString(
                  'pt-BR'
                )}
              </Text>

              <Text
                style={
                  styles.detalhes
                }
              >
                Ver detalhes →
              </Text>

            </TouchableOpacity>
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

    input: {
      backgroundColor:
        '#FFF',
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      fontSize: 16,
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

      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
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
      fontSize: 15,
    },

    plano: {
      color: '#39D353',
      fontWeight:
        'bold',
      marginTop: 10,
      fontSize: 16,
    },

    data: {
      color: '#CCC',
      marginTop: 10,
      fontSize: 13,
    },

    detalhes: {
      color: '#F5B800',
      marginTop: 12,
      fontWeight: 'bold',
      fontSize: 15,
    },

    adminTag: {
      backgroundColor:
        '#FF3B30',
      alignSelf:
        'flex-start',
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginBottom: 10,
    },

    adminTexto: {
      color: '#FFF',
      fontWeight:
        'bold',
      fontSize: 12,
    },

  });
