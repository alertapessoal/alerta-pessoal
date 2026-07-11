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

export default function AdminAuditoriaScreen() {

  const [eventos, setEventos] =
    useState<any[]>([]);

  useEffect(() => {
    carregarAuditoria();
  }, []);

  async function carregarAuditoria() {

    try {

      const listaEventos: any[] = [];

      const { data: usuarios } =
        await supabase
          .from('usuarios')
          .select(
            'id, nome, created_at'
          );

      (usuarios || []).forEach(
        (usuario) => {

          listaEventos.push({
            tipo: 'usuario',
            titulo:
              'Novo usuário cadastrado',
            descricao:
              usuario.nome,
            data:
              usuario.created_at,
          });
        }
      );

      const { data: assinaturas } =
        await supabase
          .from('assinaturas')
          .select(
            'valor_pago, created_at'
          );

      (assinaturas || []).forEach(
        (assinatura) => {

          listaEventos.push({
            tipo: 'assinatura',
            titulo:
              'Nova assinatura',
            descricao:
              `R$ ${Number(
                assinatura.valor_pago
              ).toFixed(2)}`,
            data:
              assinatura.created_at,
          });
        }
      );

      const { data: comissoes } =
        await supabase
          .from('comissoes')
          .select(
            'valor, data_liberacao'
          );

      (comissoes || []).forEach(
        (comissao) => {

          listaEventos.push({
            tipo: 'comissao',
            titulo:
              'Comissão gerada',
            descricao:
              `R$ ${Number(
                comissao.valor
              ).toFixed(2)}`,
            data:
              comissao.data_liberacao,
          });
        }
      );

      const { data: saques } =
        await supabase
          .from('saques')
          .select(
            'valor, data_solicitacao'
          );

      (saques || []).forEach(
        (saque) => {

          listaEventos.push({
            tipo: 'saque',
            titulo:
              'Saque solicitado',
            descricao:
              `R$ ${Number(
                saque.valor
              ).toFixed(2)}`,
            data:
              saque.data_solicitacao,
          });
        }
      );

      const { data: auditoriaSaques } =
        await supabase
          .from('auditoria_saques')
          .select('*');

      (auditoriaSaques || []).forEach(
        (registro) => {

          listaEventos.push({

            tipo: 'auditoria',

            titulo:
              registro.acao ===
              'APROVADO'
                ? 'Saque aprovado'
                : 'Saque recusado',

            descricao:
              `${registro.usuario_nome}
R$ ${Number(
  registro.valor || 0
).toFixed(2)}
Admin: ${registro.admin_nome}`,

            data:
              registro.created_at,

          });

        }
      );

      listaEventos.sort(
        (a, b) =>
          new Date(
            b.data
          ).getTime()
          -
          new Date(
            a.data
          ).getTime()
      );

      setEventos(
        listaEventos
      );

    } catch (erro) {

      logger.log(
        erro
      );
    }
  }

  function icone(
    tipo: string
  ) {

    switch (tipo) {

      case 'usuario':
        return '👤';

      case 'assinatura':
        return '⭐';

      case 'comissao':
        return '💰';

      case 'saque':
        return '🏦';

      case 'auditoria':
        return '📋';

      default:
        return '📄';
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
          Auditoria
        </Text>

        <View style={{ width: 32 }} />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {eventos.map(
          (
            evento,
            index
          ) => (

            <View
              key={index}
              style={styles.card}
            >

              <Text style={styles.icone}>
                {icone(
                  evento.tipo
                )}
              </Text>

              <Text
                style={[
                  styles.tituloEvento,

                  evento.titulo ===
                  'Saque aprovado'
                    ? {
                        color:
                          '#39D353',
                      }
                    : evento.titulo ===
                      'Saque recusado'
                    ? {
                        color:
                          '#FF3B30',
                      }
                    : null,
                ]}
              >
                {evento.titulo}
              </Text>

              <Text style={styles.descricao}>
                {evento.descricao}
              </Text>

              <Text style={styles.data}>
                {new Date(
                  evento.data
                ).toLocaleString(
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

  icone: {
    fontSize: 26,
    marginBottom: 10,
  },

  tituloEvento: {
    color: '#F5B800',
    fontSize: 18,
    fontWeight: 'bold',
  },

  descricao: {
    color: '#FFF',
    marginTop: 5,
    fontSize: 15,
    lineHeight: 22,
  },

  data: {
    color: '#CCC',
    marginTop: 10,
    fontSize: 13,
  },

});
