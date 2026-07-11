import { logger } from '../lib/logger';
import {
  Alert,
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

import { api } from '../lib/api';

export default function SaqueScreen() {

  const [saldoDisponivel, setSaldoDisponivel] = useState(0);
  const [saldoBloqueado, setSaldoBloqueado] = useState(0);
  const [valorSaque, setValorSaque] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [cpfPix, setCpfPix] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const data = await api.get('/afiliado/me');

      if (data.afiliado) {
        setSaldoDisponivel(Number(data.afiliado.saldo_disponivel || 0));
        setSaldoBloqueado(Number(data.afiliado.saldo_bloqueado || 0));
      }
    } catch (erro) {
      logger.log(erro);
    }
  }

  const solicitarSaque = async () => {
    try {
      if (saldoDisponivel < 100) {
        Alert.alert(
          'Saldo insuficiente',
          'Você precisa acumular pelo menos R$ 100,00 para solicitar saque.'
        );
        return;
      }

      const valor = Number(valorSaque.replace(',', '.'));

      if (!valor) {
        Alert.alert('Erro', 'Informe o valor do saque.');
        return;
      }

      if (valor < 100) {
        Alert.alert('Erro', 'Valor mínimo para saque é R$ 100,00');
        return;
      }

      if (valor > saldoDisponivel) {
        Alert.alert('Erro', 'Saldo insuficiente');
        return;
      }

      if (!chavePix || !cpfPix) {
        Alert.alert('Erro', 'Informe a chave PIX e o CPF do PIX.');
        return;
      }

      setCarregando(true);

      await api.post('/saque/solicitar', {
        valor,
        chavePix,
        cpfPix,
      });

      Alert.alert('Sucesso', 'Saque solicitado com sucesso.');

      setValorSaque('');
      setChavePix('');
      setCpfPix('');

      await carregarDados();

    } catch (erro: any) {
      Alert.alert('Erro', erro?.message || 'Erro inesperado.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={32} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.titulo}>Solicitar saque</Text>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.saldosRow}>

          <View style={styles.cardSaldo}>
            <Text style={styles.cardTitulo}>
              Saldo disponível para saque
            </Text>
            <Text style={styles.valorVerde}>
              R$ {saldoDisponivel.toFixed(2)}
            </Text>
          </View>

          <View style={styles.cardSaldo}>
            <Text style={styles.cardTitulo}>
              Saldo bloqueado aguardando liberação
            </Text>
            <Text style={styles.valorAzul}>
              R$ {saldoBloqueado.toFixed(2)}
            </Text>
          </View>

        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitulo}>Valor do saque</Text>

          <Text style={styles.disponivel}>
            Disponível para saque:
            <Text style={styles.valorAmarelo}>
              {' '}R$ {saldoDisponivel.toFixed(2)}
            </Text>
          </Text>

          <TextInput
            style={styles.input}
            placeholder="R$ 0,00"
            placeholderTextColor="#AAA"
            keyboardType="numeric"
            value={valorSaque}
            onChangeText={setValorSaque}
          />

          <View style={styles.limites}>
            <Text style={styles.textoLimite}>Mínimo: R$ 100,00</Text>
            <Text style={styles.textoLimite}>
              Máximo: R$ {saldoDisponivel.toFixed(2)}
            </Text>
          </View>

        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitulo}>Chave PIX cadastrada</Text>

          <TextInput
            style={styles.input}
            placeholder="Chave PIX (digitar)"
            placeholderTextColor="#85cc7b"
            value={chavePix}
            onChangeText={setChavePix}
          />

          <TextInput
            style={styles.input}
            placeholder="CPF do PIX (digitar)"
            placeholderTextColor="#4e99a8"
            value={cpfPix}
            onChangeText={setCpfPix}
          />

          <Text style={styles.avisoPix}>
            ⚠️ Por segurança, somente serão aceitas chaves PIX de titularidade do mesmo CPF cadastrado na conta. Solicitações com dados divergentes poderão ser recusadas.
          </Text>

        </View>

        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={28}
            color="#49A6FF"
          />
          <Text style={styles.infoTexto}>
            O valor solicitado será transferido para sua chave PIX em até 2 dias úteis após a aprovação.
            {'\n\n'}
            Lembre-se: o saldo bloqueado será liberado após 30 dias da confirmação do pagamento pelo indicado.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.botao, carregando && { opacity: 0.6 }]}
          onPress={solicitarSaque}
          disabled={carregando}
        >
          <Text style={styles.botaoTexto}>
            {carregando ? 'AGUARDE...' : 'SOLICITAR SAQUE'}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  titulo: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  saldosRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  cardSaldo: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 18,
    padding: 15,
  },

  card: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },

  cardTitulo: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  valorVerde: {
    color: '#39D353',
    fontSize: 22,
    fontWeight: 'bold',
  },

  valorAzul: {
    color: '#49A6FF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  disponivel: {
    color: '#FFF',
    marginBottom: 15,
    fontSize: 16,
  },

  valorAmarelo: {
    color: '#F5B800',
    fontWeight: 'bold',
  },

  input: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 12,
    padding: 15,
    color: '#FFF',
    fontSize: 15,
    marginBottom: 15,
  },

  limites: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  textoLimite: {
    color: '#FFF',
    fontSize: 15,
  },

  avisoPix: {
    color: '#F5B800',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 5,
  },

  infoBox: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },

  infoTexto: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    lineHeight: 24,
  },

  botao: {
    backgroundColor: '#F5B800',
    borderRadius: 15,
    padding: 18,
    marginBottom: 30,
  },

  botaoTexto: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#031B4E',
  },

});

