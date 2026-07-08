import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';


export default function AfiliadosScreen() {

  const [codigoAfiliado, setCodigoAfiliado] =
    useState('');

  const [saldoDisponivel, setSaldoDisponivel] =
    useState(0);

  const [saldoBloqueado, setSaldoBloqueado] =
    useState(0);

 const carregarAfiliado = async () => {
  try {

    const data = await api.get('/afiliado/me');

    if (!data) {
      return;
    }

    setCodigoAfiliado(
      data.codigo_afiliado
    );

    setSaldoDisponivel(
      Number(
        data.saldo_disponivel || 0
      )
    );

    setSaldoBloqueado(
      Number(
        data.saldo_bloqueado || 0
      )
    );

  } catch (erro) {
    console.log(erro);
  }
};

useEffect(() => {
  void carregarAfiliado();
}, []);

  const compartilharCodigo = async () => {

    try {

      await Share.share({
        message:
          `🚨 Alerta Pessoal\n\n` +
          `Use meu código de indicação:\n\n` +
          `${codigoAfiliado}\n\n` +
          `Cadastre-se e acompanhe processos, mandados e notificações em tempo real.`,
      });

    } catch (erro) {
      console.log(erro);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
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
          Programa de Afiliados
        </Text>

        <View style={{ width: 32 }} />
      </View>

      <Text style={styles.subtitulo}>
        Convide amigos e ganhe comissões.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.saldosRow}>

          <View style={styles.cardSaldo}>

            <Text style={styles.cardTitulo}>
              Saldo disponível
            </Text>

            <Text style={styles.valorVerde}>
              R$ {saldoDisponivel.toFixed(2)}
            </Text>

            <Text style={styles.cardTexto}>
              Disponível para saque
            </Text>

          </View>

          <View style={styles.cardSaldo}>

            <Text style={styles.cardTitulo}>
              Saldo bloqueado
            </Text>

            <Text style={styles.valorAmarelo}>
              R$ {saldoBloqueado.toFixed(2)}
            </Text>

            <Text style={styles.cardTexto}>
              Aguardando liberação
            </Text>

          </View>

        </View>

        <View style={styles.cardGrande}>

          <Text style={styles.cardTitulo}>
            Comissão por Plano
          </Text>

          <View style={styles.linha}>
            <Text style={styles.verde}>●</Text>
            <Text style={styles.plano}>
              Gratuito
            </Text>
            <Text style={styles.percentual}>
              5%
            </Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.azul}>●</Text>
            <Text style={styles.plano}>
              Básico
            </Text>
            <Text style={styles.percentual}>
              10%
            </Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.amarelo}>●</Text>
            <Text style={styles.plano}>
              Plus
            </Text>
            <Text style={styles.percentual}>
              15%
            </Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.vermelho}>●</Text>
            <Text style={styles.plano}>
              Premium
            </Text>
            <Text style={styles.percentual}>
              20%
            </Text>
          </View>

        </View>

        <View style={styles.cardGrande}>

          <Text style={styles.cardTitulo}>
            Seu código de afiliado
          </Text>

          <View style={styles.linkBox}>

            <Text style={styles.link}>
              {codigoAfiliado}
            </Text>

            <Ionicons
              name="people-outline"
              size={26}
              color="#FFF"
            />

          </View>

        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={compartilharCodigo}
        >
          <Text style={styles.botaoTexto}>
            CONVIDAR AMIGOS
          </Text>
        </TouchableOpacity>

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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  titulo: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },

  subtitulo: {
    color: '#fff203',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 25,
  },

  saldosRow: {
    flexDirection: 'row',
    gap: 10,
  },

  cardSaldo: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 18,
    padding: 15,
  },

  cardGrande: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 18,
    padding: 18,
    marginTop: 15,
  },

  cardTitulo: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  valorVerde: {
    color: '#39D353',
    fontSize: 25,
    fontWeight: 'bold',
  },

  valorAmarelo: {
    color: '#F5B800',
    fontSize: 25,
    fontWeight: 'bold',
  },

  cardTexto: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 10,
  },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  plano: {
    flex: 1,
    color: '#FFF',
    fontSize: 18,
    marginLeft: 10,
  },

  percentual: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  verde: {
    color: '#39D353',
    fontSize: 26,
  },

  azul: {
    color: '#49A6FF',
    fontSize: 26,
  },

  amarelo: {
    color: '#F5B800',
    fontSize: 26,
  },

  vermelho: {
    color: '#FF3B30',
    fontSize: 26,
  },

  linkBox: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  link: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  botao: {
    backgroundColor: '#F5B800',
    borderRadius: 15,
    padding: 18,
    marginTop: 25,
    marginBottom: 30,
  },

  botaoTexto: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    color: '#031B4E',
  },

});