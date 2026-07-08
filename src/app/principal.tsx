import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomMenu from '../components/BottomMenu';
import { api } from '../lib/api';
import {
  configurarListenerNotificacao,
  registrarPushToken,
} from '../lib/push';

export default function PrincipalScreen() {

  const [plano, setPlano] =
    useState('Carregando...');

  const [frequencia, setFrequencia] =
    useState('24 horas');

  const [notificacoes, setNotificacoes] =
    useState(0);

  const [ultimaConsulta, setUltimaConsulta] =
    useState('Nunca');

  const [proximaConsulta, setProximaConsulta] =
    useState('Aguardando');

  const [possuiMandado, setPossuiMandado] =
    useState(false);

  const [mandados, setMandados] =
    useState<any[]>([]);

  useEffect(() => {
    carregarDados();
    registrarPushToken();

    const remover = configurarListenerNotificacao(() => {
      router.push('/alertas');
    });

    return remover;
  }, []);

  async function carregarDados() {

    try {

      const dados = await api.get('/painel/dados');

      setPlano(dados.plano);
      setFrequencia(dados.frequencia);
      setNotificacoes(dados.notificacoes);
      setUltimaConsulta(dados.ultimaConsulta);
      setProximaConsulta(dados.proximaConsulta);
      setPossuiMandado(dados.possuiMandado);
      setMandados(dados.mandados || []);

    } catch (erro) {

      console.log(
        erro
      );

    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="menu"
          size={32}
          color="#FFF"
        />

        <View style={styles.notification}>
          <Ionicons
            name="notifications-outline"
            size={28}
            color="#F5B800"
          />

          <View style={styles.badge}>
  <Text style={styles.badgeText}>
  {notificacoes}
</Text>
          </View>
        </View>
      </View>

      <Text style={styles.titulo}>Painel</Text>

      <Text style={styles.subtitulo}>
        Acompanhe a situação do seu CPF.
      </Text>

      <View style={styles.cardStatus}>
        <Text style={styles.cardTitulo}>
          SITUAÇÃO ATUAL
        </Text>

        <View style={styles.statusRow}>
          <View
            style={
              possuiMandado
                ? styles.circleAlerta
                : styles.circle
            }
          >
            <Ionicons
              name={
                possuiMandado
                  ? 'warning'
                  : 'checkmark'
              }
              size={60}
              color="#FFF"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={
                possuiMandado
                  ? styles.mandadoEncontrado
                  : styles.nadaConsta
              }
            >
              {possuiMandado
                ? 'MANDADO ENCONTRADO'
                : 'NADA CONSTA'}
            </Text>

            <Text style={styles.statusTexto}>
              {possuiMandado
                ? `Foi identificado ${mandados.length} mandado(s) de prisão vinculado(s) ao seu CPF.`
                : 'Nenhum mandado de prisão encontrado.'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.item}>
          <Feather
            name="calendar"
            size={22}
            color="#FFF"
          />

          <View>
            <Text style={styles.itemTitulo}>
              Última verificação
            </Text>

            <Text style={styles.itemTexto}>
              {ultimaConsulta}
            </Text>
          </View>
        </View>

        <View style={styles.item}>
          <Feather
            name="clock"
            size={22}
            color="#FFF"
          />

          <View>
            <Text style={styles.itemTitulo}>
              Próxima verificação
            </Text>

            <Text style={styles.itemTexto}>
          {proximaConsulta}
            </Text>
          </View>
        </View>

        <View style={styles.item}>
          <MaterialCommunityIcons
            name="shield-check"
            size={22}
            color="#F5B800"
          />

          <View>
            <Text style={styles.itemTitulo}>
              Frequência do plano
            </Text>

            <Text style={styles.itemTexto}>
  {frequencia}
</Text>
          </View>
        </View>

        <View style={styles.item}>
          <Ionicons
            name="star"
            size={22}
            color="#F5B800"
          />

          <View>
            <Text style={styles.itemTitulo}>
              Plano atual
            </Text>

            <Text style={styles.itemTexto}>
            {plano}
            </Text>
          </View>
        </View>
      </View>

<BottomMenu />

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
    justifyContent: 'space-between',
    marginTop: 20,
  },

  notification: {
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#F5B800',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  titulo: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },

  subtitulo: {
    color: '#FFF',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 25,
  },

  cardStatus: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 20,
    padding: 20,
  },

  cardTitulo: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2EAF48',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },

  nadaConsta: {
    color: '#39D353',
    fontSize: 28,
    fontWeight: 'bold',
  },

  circleAlerta: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },

  mandadoEncontrado: {
    color: '#FF5C5C',
    fontSize: 24,
    fontWeight: 'bold',
  },

  statusTexto: {
    color: '#FFF',
    fontSize: 15,
    marginTop: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#14396E',
    marginVertical: 20,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 15,
  },

  itemTitulo: {
    color: '#FFF',
    fontSize: 15,
  },

  itemTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },


});
