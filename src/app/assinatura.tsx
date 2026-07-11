import { logger } from '../lib/logger';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '../lib/api';

export default function AssinaturaScreen() {

  const [planoSelecionado, setPlanoSelecionado] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarPlanoAtual();
  }, []);

  async function carregarPlanoAtual() {
    try {
      const data = await api.get('/usuario/perfil');
      const nomePlano =
        data.usuario?.plano?.nome?.toLowerCase() || 'gratuito';
      setPlanoSelecionado(nomePlano);
    } catch (erro) {
      logger.log(erro);
      setPlanoSelecionado('gratuito');
    }
  }

  const alterarPlano = async () => {
    try {
      if (!planoSelecionado) {
        Alert.alert('Erro', 'Selecione um plano.');
        return;
      }

      setCarregando(true);

      await api.post('/assinatura/alterar', {
        planoNome: planoSelecionado,
      });

      Alert.alert('Sucesso', 'Plano alterado com sucesso!');
      await carregarPlanoAtual();

    } catch (erro: any) {
      Alert.alert('Erro', erro?.message || 'Erro inesperado.');
    } finally {
      setCarregando(false);
    }
  };

  const PlanoCard = ({
    nome,
    preco,
    itens,
    cor,
    borda,
    valorPlano,
  }: any) => (
    <TouchableOpacity
      style={[
        styles.plano,
        { backgroundColor: cor, borderColor: borda },
      ]}
      onPress={() => setPlanoSelecionado(valorPlano)}
    >
      <View style={styles.topoPlano}>
        <Text style={styles.nomePlano}>{nome}</Text>
        <Text style={styles.preco}>{preco}</Text>
      </View>

      {itens.map((item: string, index: number) => (
        <Text key={index} style={styles.item}>
          • {item}
        </Text>
      ))}

      <View style={styles.radio}>
        {planoSelecionado === valorPlano && (
          <Ionicons name="checkmark" size={26} color="#000" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={36} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.titulo}>Assinaturas</Text>

        <Text style={styles.subtitulo}>
          Escolha o plano ideal para você.
        </Text>

        <Text style={styles.planoAtual}>
          Plano Atual: {planoSelecionado?.toUpperCase()}
        </Text>

        <PlanoCard
          nome="Gratuito"
          preco="R$ 0,00"
          valorPlano="gratuito"
          cor="#157A2C"
          borda="#2EAF48"
          itens={[
            '1 verificação por semana',
            'Alertas por push',
            'Comissão 5%',
          ]}
        />

        <PlanoCard
          nome="Premium"
          preco="R$ 69,90/semestral"
          valorPlano="premium"
          cor="#700372"
          borda="#ff30fc"
          itens={[
            'Consulta a cada 1h',
            'Alertas imediatos',
            'Histórico 30 dias',
            'Comissão 10%',
          ]}
        />

        <PlanoCard
          nome="Ouro Anual"
          preco="R$ 99,90/ano"
          valorPlano="ouro anual"
          cor="#B8860B"
          borda="#F5B800"
          itens={[
            'Consulta a cada 1h',
            'Alertas imediatos',
            'Histórico 30 dias',
            'Comissão 10%',
          ]}
        />

        <TouchableOpacity
          style={[
            styles.botaoSalvar,
            carregando && { backgroundColor: '#666' },
          ]}
          onPress={alterarPlano}
          disabled={carregando}
        >
          <Text style={styles.botaoSalvarTexto}>
            {carregando ? 'AGUARDE...' : 'ALTERAR PLANO'}
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

  titulo: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },

  subtitulo: {
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },

  planoAtual: {
    color: '#F5B800',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  plano: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    position: 'relative',
  },

  topoPlano: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  nomePlano: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  preco: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  item: {
    color: '#FFF',
    marginBottom: 6,
    paddingRight: 40,
  },

  radio: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoSalvar: {
    backgroundColor: '#F5B800',
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },

  botaoSalvarTexto: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

