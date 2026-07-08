/* eslint-disable react-hooks/static-components */
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

import { supabase } from '../lib/supabase';

export default function AssinaturaScreen() {

  const [planoSelecionado, setPlanoSelecionado] =
    useState('');

  useEffect(() => {
    carregarPlanoAtual();
  }, []);

async function carregarPlanoAtual() {
    try {

      const usuarioStorage =
        await AsyncStorage.getItem(
          'usuarioLogado'
        );

      if (!usuarioStorage) return;

      const usuario =
        JSON.parse(usuarioStorage);


      const { data } = await supabase
        .from('assinaturas')
        .select(`
          *,
          planos(*)
        `)
        .eq('usuario_id', usuario.id)
        .eq('status', 'ativo')
        .single();

      if (!data) {
        setPlanoSelecionado('gratuito');
        return;
      }

      setPlanoSelecionado(
        data.planos.nome.toLowerCase()
      );

    } catch (erro) {
      console.log(erro);
    }
  };

  const alterarPlano = async () => {
    try {

      const usuarioStorage =
        await AsyncStorage.getItem(
          'usuarioLogado'
        );

      if (!usuarioStorage) {
        Alert.alert(
          'Erro',
          'Usuário não encontrado.'
        );
        return;
      }

      const usuario =
        JSON.parse(usuarioStorage);

        if (!planoSelecionado) {
  Alert.alert(
    'Erro',
    'Selecione um plano.'
  );
  return;
}
      
   const {
  data: planos,
  error: erroPlanos,
} = await supabase
  .from('planos')
  .select('*');

if (erroPlanos) {
  Alert.alert(
    'Erro',
    erroPlanos.message
  );
  return;
}

const plano = planos?.find(
  (p) =>
    p.nome.toLowerCase() ===
    planoSelecionado.toLowerCase()
);



      if (!plano) {
        Alert.alert(
          'Erro',
          'Plano não encontrado.'
        );
        return;
      }

const {
  data: assinaturaAtual,
  error: erroAssinaturaAtual,
} = await supabase
    .from('assinaturas')
    .select(`
      *,
      planos(*)
    `)
    .eq('usuario_id', usuario.id)
    .eq('status', 'ativo')
    .single();

if (
  erroAssinaturaAtual &&
  erroAssinaturaAtual.code !== 'PGRST116'
) {
  Alert.alert(
    'Erro',
    erroAssinaturaAtual.message
  );
  return;
}

if (
  assinaturaAtual?.planos?.nome
    ?.toLowerCase() ===
  planoSelecionado.toLowerCase()
) {
  Alert.alert(
    'Aviso',
    'Você já possui este plano.'
  );
  return;
}

      const {
  error: erroCancelar,
} = await supabase
  .from('assinaturas')
  .update({
    status: 'cancelado',
  })
  .eq('usuario_id', usuario.id)
  .eq('status', 'ativo');

if (erroCancelar) {
  Alert.alert(
    'Erro',
    erroCancelar.message
  );
  return;
}
      const hoje = new Date();

      const vencimento = new Date();

      vencimento.setFullYear(
        vencimento.getFullYear() + 1
      );

     const { error } = await supabase
  .from('assinaturas')
  .insert([
    {
      usuario_id: usuario.id,
      plano_id: plano.id,
      valor_pago: plano.valor,
      data_inicio: hoje.toISOString(),
      data_fim: vencimento.toISOString(),
      status: 'ativo',
    },
  ]);

if (error) {
  Alert.alert(
    'Erro',
    error.message
  );
  return;
}

const { data: usuarioAtual } =
  await supabase
    .from('usuarios')
    .select('*')
    .eq('id', usuario.id)
    .single();

const { data: comissaoExistente } =
  await supabase
    .from('comissoes')
    .select('id')
    .eq('indicado_id', usuario.id)
    .maybeSingle();

if (
  usuarioAtual?.codigo_indicacao &&
  !comissaoExistente
) {

  const { data: afiliado } =
    await supabase
      .from('afiliados')
      .select('*')
      .eq(
        'codigo_afiliado',
        usuarioAtual.codigo_indicacao
      )
      .single();

  if (afiliado) {

  const percentual =
    Number(plano.percentual_comissao);

  const valorComissao =
    Number(plano.valor) *
    (percentual / 100);

  const dataLiberacao = new Date();

  dataLiberacao.setDate(
    dataLiberacao.getDate() + 30
  );

  const {
    error: erroComissao,
  } = await supabase
    .from('comissoes')
    .insert([
      {
        afiliado_id: afiliado.usuario_id,
        indicado_id: usuario.id,
        percentual,
        valor: valorComissao,
        status: 'bloqueado',
        data_liberacao:
          dataLiberacao.toISOString(),
      },
    ]);

  if (erroComissao) {
    Alert.alert(
      'Erro',
      'Não foi possível gerar a comissão.'
    );
    return;
  }

 const {
  error: erroSaldo,
} = await supabase
  .from('afiliados')
  .update({
    saldo_bloqueado:
      Number(
        afiliado.saldo_bloqueado || 0
      ) + valorComissao,
  })
  .eq('id', afiliado.id);

if (erroSaldo) {
  console.log(
    'ERRO SALDO:',
    erroSaldo
  );
}
}
}

    
      Alert.alert(
        'Sucesso',
        'Plano alterado com sucesso!'
      );

      carregarPlanoAtual();await supabase

    } catch (erro: any) {
      Alert.alert(
        'Erro',
        erro.message
      );
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
        {
          backgroundColor: cor,
          borderColor: borda,
        },
      ]}
      onPress={() =>
        setPlanoSelecionado(valorPlano)
      }
    >
      <View style={styles.topoPlano}>
        <Text style={styles.nomePlano}>
          {nome}
        </Text>

        <Text style={styles.preco}>
          {preco}
        </Text>
      </View>

      {itens.map(
        (item: string, index: number) => (
          <Text
            key={index}
            style={styles.item}
          >
            • {item}
          </Text>
        )
      )}

      <View style={styles.radio}>
        {planoSelecionado ===
          valorPlano && (
          <Ionicons
            name="checkmark"
            size={26}
            color="#000"
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={36}
            color="#FFF"
          />
        </TouchableOpacity>

        <Text style={styles.titulo}>
          Assinaturas
        </Text>

        <Text style={styles.subtitulo}>
          Escolha o plano ideal para você.
        </Text>

        <Text style={styles.planoAtual}>
          Plano Atual:
          {' '}
          {planoSelecionado
            ?.toUpperCase()}
        </Text>

        <PlanoCard
          nome="Gratuito"
          preco="R$ 0,00/ano"
          valorPlano="gratuito"
          cor="#157A2C"
          borda="#2EAF48"
          itens={[
            '1 verificação por semana',
            'Alertas por push',
            'Histórico 7 dias',
            'Comissão 5%',
          ]}
        />

        <PlanoCard
          nome="Basico"
          preco="R$ 59,90/ano"
          valorPlano="basico"
          cor="#003E8A"
          borda="#1F6FE5"
          itens={[
            'Consulta diária',
            'Alertas por push',
            'Histórico 15 dias',
            'Comissão 10%',
          ]}
        />

        <PlanoCard
          nome="Plus"
          preco="R$ 89,90/ano"
          valorPlano="plus"
          cor="#B8860B"
          borda="#F5B800"
          itens={[
            'Consulta a cada 6h',
            'Alertas prioritários',
            'Histórico 30 dias',
            'Comissão 15%',
          ]}
        />

        <PlanoCard
          nome="Premium"
          preco="R$ 129,90/ano"
          valorPlano="premium"
          cor="#700372"
          borda="#ff30fc"
          itens={[
            'Consulta a cada 1h',
            'Alerta imediato',
            'Histórico 12 meses',
            'Comissão 20%',
          ]}
        />

        <TouchableOpacity
          style={styles.botaoSalvar}
          onPress={alterarPlano}
        >
          <Text
            style={styles.botaoSalvarTexto}
          >
            ALTERAR PLANO
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