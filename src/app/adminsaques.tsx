import { logger } from '../lib/logger';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { supabase } from '../lib/supabase';

export default function AdminSaquesScreen() {

const [saques, setSaques] =
useState<any[]>([]);

const [filtro, setFiltro] =
useState('todos');

const [busca, setBusca] =
useState('');

useEffect(() => {
carregarSaques();
}, []);

async function carregarSaques() {


try {

  const { data, error } =
    await supabase
      .from('saques')
      .select('*')
      .order(
        'data_solicitacao',
        {
          ascending: false,
        }
      );

  if (error) {
    Alert.alert(
      'Erro',
      error.message
    );
    return;
  }

  const listaCompleta =
    await Promise.all(

      (data || []).map(
        async (saque) => {

          try {

            const {
              data: usuario
            } = await supabase
              .from('usuarios')
              .select(`
                nome,
                cpf
              `)
              .eq(
                'id',
                saque.usuario_id
              )
              .maybeSingle();

            return {
              ...saque,
              usuarioNome:
                usuario?.nome ||
                'Usuário',
              usuarioCpf:
                usuario?.cpf || '',
            };

          } catch {

            return {
              ...saque,
              usuarioNome:
                'Usuário',
              usuarioCpf: '',
            };
          }
        }
      )
    );

  setSaques(
    listaCompleta
  );

} catch (erro: any) {

  Alert.alert(
    'Erro',
    erro.message
  );
}


}

async function aprovarSaque(
id: string
) {


const { error } =
  await supabase
    .from('saques')
    .update({
      status: 'aprovado',
      data_pagamento:
        new Date().toISOString(),
    })
    .eq('id', id);

if (error) {

  Alert.alert(
    'Erro',
    error.message
  );

  return;
}
const saque =
  saques.find(
    item =>
      item.id === id
  );

if (saque) {

 await registrarAuditoria(
  saque,
  'APROVADO'
);

}


carregarSaques();


}

async function recusarSaque(
id: string
) {


const { error } =
  await supabase
    .from('saques')
    .update({
      status: 'recusado',
      data_recusa:
        new Date().toISOString(),
    })
    .eq('id', id);

if (error) {

  Alert.alert(
    'Erro',
    error.message
  );

  return;
}

const saque =
  saques.find(
    item =>
      item.id === id
  );

if (saque) {

  await registrarAuditoria(
    saque,
    'RECUSADO'
  );

}

carregarSaques();

}

async function copiarTexto(
  texto: string
) {

  await Clipboard.setStringAsync(
    texto || ''
  );

  Alert.alert(
    'Sucesso',
    'Texto copiado'
  );
}

async function registrarAuditoria(
  saque: any,
  acao: string
) {

  const { data, error } =
    await supabase
      .from('auditoria_saques')
      .insert({

        saque_id:
          saque.id,

        usuario_id:
          saque.usuario_id,

        usuario_nome:
          saque.usuarioNome,

        valor:
          saque.valor,

        acao,

        admin_nome:
          'Administrador',

      })
      .select();

  logger.log(
    'AUDITORIA DATA:',
    data
  );

  logger.log(
    'AUDITORIA ERROR:',
    error
  );

}

const saquesFiltrados =
  saques.filter(item => {

    const nome =
      item.usuarioNome
        ?.toLowerCase() || '';

    const buscaNome =
      busca.toLowerCase();

    const filtroStatus =
      filtro === 'todos'
      || item.status === filtro;



    return (
      filtroStatus &&
      nome.includes(
        buscaNome
      )
    );
  });

const totalPendente =
  saques
    .filter(
      item =>
        item.status ===
        'pendente'
    )
    .reduce(
      (total, item) =>
        total +
        Number(
          item.valor || 0
        ),
      0
    );

const totalAprovado =
  saques
    .filter(
      item =>
        item.status ===
        'aprovado'
    )
    .reduce(
      (total, item) =>
        total +
        Number(
          item.valor || 0
        ),
      0
    );

const totalRecusado =
  saques
    .filter(
      item =>
        item.status ===
        'recusado'
    )
    .reduce(
      (total, item) =>
        total +
        Number(
          item.valor || 0
        ),
      0
    );

const totalGeral =
  totalPendente +
  totalAprovado +
  totalRecusado;

const quantidadePendentes =
  saques.filter(
    item =>
      item.status === 'pendente'
  ).length;

const quantidadeAprovados =
  saques.filter(
    item =>
      item.status === 'aprovado'
  ).length;

const quantidadeRecusados =
  saques.filter(
    item =>
      item.status === 'recusado'
  ).length;

const totalSolicitacoes =
  saques.length;

const totalPago =
  saques
    .filter(
      item =>
        item.status ===
        'aprovado'
    )
    .reduce(
      (total, item) =>
        total +
        Number(
          item.valor || 0
        ),
      0
    );

const totalPendenteDashboard =
  saques
    .filter(
      item =>
        item.status ===
        'pendente'
    )
    .reduce(
      (total, item) =>
        total +
        Number(
          item.valor || 0
        ),
      0
    );

return (


<SafeAreaView
  style={styles.container}
>

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
      Administração de Saques
    </Text>

    <View
      style={{
        width: 32,
      }}
    />

  </View>

<View style={styles.dashboard}>

  <View style={styles.dashboardCard}>
    <Text style={styles.dashboardNumero}>
      R$ {totalPago.toFixed(2)}
    </Text>

    <Text style={styles.dashboardTitulo}>
      💰 Total Pago
    </Text>
  </View>

  <View style={styles.dashboardCard}>
    <Text style={styles.dashboardNumero}>
      R$ {totalPendenteDashboard.toFixed(2)}
    </Text>

    <Text style={styles.dashboardTitulo}>
      ⏳ Pendente
    </Text>
  </View>

  <View style={styles.dashboardCard}>
    <Text style={styles.dashboardNumero}>
      {quantidadePendentes}
    </Text>

    <Text style={styles.dashboardTitulo}>
      🏦 Saques
    </Text>
  </View>

  <View style={styles.dashboardCard}>
    <Text style={styles.dashboardNumero}>
      {totalSolicitacoes}
    </Text>

    <Text style={styles.dashboardTitulo}>
      📄 Total
    </Text>
  </View>

</View>

<View style={styles.filtros}>

  <TouchableOpacity
    style={styles.filtroBotao}
    onPress={() =>
      setFiltro('todos')
    }
  >
    <Text style={styles.filtroTexto}>
      Todos
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.filtroBotao}
    onPress={() =>
      setFiltro('pendente')
    }
  >
    <Text style={styles.filtroTexto}>
      Pendentes
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.filtroBotao}
    onPress={() =>
      setFiltro('aprovado')
    }
  >
    <Text style={styles.filtroTexto}>
      Aprovados
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.filtroBotao}
    onPress={() =>
      setFiltro('recusado')
    }
  >
    <Text style={styles.filtroTexto}>
      Recusados
    </Text>
  </TouchableOpacity>

</View>

<TextInput
  style={styles.inputBusca}
  placeholder="Buscar afiliado..."
  placeholderTextColor="#999"
  value={busca}
  onChangeText={setBusca}
/>
<View style={styles.resumoFinanceiro}>

  <Text style={styles.resumoTexto}>
  💰 Pendentes ({quantidadePendentes}):
  {' '}
  R$ {totalPendente.toFixed(2)}
</Text>

<Text style={styles.resumoTexto}>
  ✅ Aprovados ({quantidadeAprovados}):
  {' '}
  R$ {totalAprovado.toFixed(2)}
</Text>

<Text style={styles.resumoTexto}>
  ❌ Recusados ({quantidadeRecusados}):
  {' '}
  R$ {totalRecusado.toFixed(2)}
</Text>

  <Text style={styles.resumoTotal}>
    📊 Total Geral: R$ {totalGeral.toFixed(2)}
  </Text>

</View>


  <ScrollView
    showsVerticalScrollIndicator={
      false
    }
  >

    {saques.length === 0 && (

      <View style={styles.card}>
        <Text
          style={styles.semDados}
        >
          Nenhum saque encontrado.
        </Text>
      </View>

    )}

    {saquesFiltrados.map(
      (saque) => (

        <View
          key={saque.id}
          style={
            saque.status ===
            'aprovado'
              ? styles.cardAprovado
              : saque.status ===
                'recusado'
              ? styles.cardRecusado
              : styles.cardPendente
          }
        >

          <Text
            style={styles.nome}
          >
            {saque.usuarioNome}
          </Text>

          <Text
            style={styles.info}
          >
            CPF Cadastro:
            {' '}
            {saque.usuarioCpf}
          </Text>

          <Text
            style={styles.info}
          >
            CPF PIX:
            {' '}
            {saque.cpf_pix}
          </Text>

          <Text
  style={styles.info}
>
  Chave PIX:
  {' '}
  {saque.chave_pix}
</Text>

<View style={styles.areaCopias}>

  <TouchableOpacity
    style={styles.botaoCopiar}
    onPress={() =>
      copiarTexto(
        saque.chave_pix
      )
    }
  >
    <Ionicons
      name="copy-outline"
      size={18}
      color="#FFF"
    />

    <Text
      style={styles.botaoTexto}
    >
      Copiar PIX
    </Text>

  </TouchableOpacity>

</View>

          <Text
            style={styles.valor}
          >
            R$
            {' '}
            {Number(
              saque.valor || 0
            ).toFixed(2)}
          </Text>

          <Text
            style={styles.info}
          >
            Data Solicitação:
            {' '}
            {new Date(
              saque.data_solicitacao
            ).toLocaleString(
              'pt-BR'
            )}
          </Text>

          {saque.status ===
            'aprovado' &&
            saque.data_pagamento && (

            <Text
              style={styles.info}
            >
              Data Pagamento:
              {' '}
              {new Date(
                saque.data_pagamento
              ).toLocaleString(
                'pt-BR'
              )}
            </Text>

          )}

          {saque.status ===
            'recusado' &&
            saque.data_recusa && (

            <Text
              style={styles.info}
            >
              Data Recusa:
              {' '}
              {new Date(
                saque.data_recusa
              ).toLocaleString(
                'pt-BR'
              )}
            </Text>

          )}

          <View
            style={
              saque.status ===
              'aprovado'
                ? styles.aprovado
                : saque.status ===
                  'recusado'
                ? styles.recusado
                : styles.pendente
            }
          >

            <Text
              style={
                styles.statusTexto
              }
            >
              {saque.status.toUpperCase()}
            </Text>

          </View>

          {saque.usuarioCpf &&
           saque.cpf_pix &&
           saque.usuarioCpf !==
           saque.cpf_pix && (

            <Text
              style={styles.alerta}
            >
              ⚠ CPF diferente do cadastro
            </Text>

          )}

          {saque.status ===
            'pendente' && (

            <View
              style={styles.botoes}
            >

              <TouchableOpacity
                style={
                  styles.botaoAprovar
                }
               onPress={() =>
  Alert.alert(
    'Confirmar Aprovação',
    `Deseja aprovar o saque de R$ ${Number(
      saque.valor || 0
    ).toFixed(2)}?`,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Aprovar',
        onPress: () =>
          aprovarSaque(
            saque.id
          ),
      },
    ]
  )
}
              >
                <Text
                  style={
                    styles.botaoTexto
                  }
                >
                  Aprovar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.botaoRecusar
                }
               onPress={() =>
  Alert.alert(
    'Confirmar Recusa',
    `Deseja recusar o saque de R$ ${Number(
      saque.valor || 0
    ).toFixed(2)}?`,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Recusar',
        style: 'destructive',
        onPress: () =>
          recusarSaque(
            saque.id
          ),
      },
    ]
  )
}
              >
                <Text
                  style={
                    styles.botaoTexto
                  }
                >
                  Recusar
                </Text>
              </TouchableOpacity>

            </View>

          )}

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
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: 20,
},

titulo: {
color: '#FFF',
fontSize: 24,
fontWeight: 'bold',
},

cardPendente: {
backgroundColor: '#B8860B',
borderRadius: 18,
padding: 18,
marginBottom: 15,
},

cardAprovado: {
backgroundColor: '#157A2C',
borderRadius: 18,
padding: 18,
marginBottom: 15,
},

cardRecusado: {
backgroundColor: '#8B0000',
borderRadius: 18,
padding: 18,
marginBottom: 15,
},

card: {
backgroundColor: '#14396E',
borderRadius: 18,
padding: 18,
marginBottom: 15,
},

nome: {
color: '#FFF',
fontSize: 22,
fontWeight: 'bold',
marginBottom: 10,
},

valor: {
color: '#FFF',
fontSize: 28,
fontWeight: 'bold',
marginTop: 10,
},

info: {
color: '#FFF',
marginTop: 6,
},

alerta: {
color: '#FFD700',
marginTop: 10,
fontWeight: 'bold',
},

pendente: {
backgroundColor: '#F5B800',
alignSelf: 'flex-start',
paddingHorizontal: 12,
paddingVertical: 6,
borderRadius: 10,
marginTop: 12,
},

aprovado: {
backgroundColor: '#39D353',
alignSelf: 'flex-start',
paddingHorizontal: 12,
paddingVertical: 6,
borderRadius: 10,
marginTop: 12,
},

recusado: {
backgroundColor: '#FF3B30',
alignSelf: 'flex-start',
paddingHorizontal: 12,
paddingVertical: 6,
borderRadius: 10,
marginTop: 12,
},

statusTexto: {
color: '#000',
fontWeight: 'bold',
},

botoes: {
flexDirection: 'row',
gap: 10,
marginTop: 15,
},

botaoAprovar: {
backgroundColor: '#39D353',
padding: 10,
borderRadius: 10,
},

botaoRecusar: {
backgroundColor: '#FF3B30',
padding: 10,
borderRadius: 10,
},

botaoTexto: {
color: '#FFF',
fontWeight: 'bold',
},

semDados: {
  color: '#FFF',
  textAlign: 'center',
},

areaCopias: {
  marginTop: 10,
},

botaoCopiar: {
  backgroundColor: '#646364',
  padding: 7,
  borderRadius: 10,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 6,
},

filtros: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: 15,
},

filtroBotao: {
  backgroundColor: '#14396E',
  paddingHorizontal: 6,
  paddingVertical: 5,
  borderRadius: 7,
},

filtroTexto: {
  color: '#FFF',
  fontWeight: 'bold',
},

inputBusca: {
  backgroundColor: '#FFF',
  borderRadius: 12,
  padding: 6,
  marginBottom: 15,
  fontSize: 16,
},

resumoFinanceiro: {
  backgroundColor: '#14396E',
  padding: 10,
  borderRadius: 15,
  marginBottom: 15,
},

resumoTexto: {
  color: '#FFF',
  fontSize: 14,
  marginBottom: 6,
},

resumoTotal: {
  color: '#FFD700',
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: 10,
},

resumoCabecalho: {
  color: '#FFF',
  fontSize: 13,
  marginBottom: 10,
  opacity: 0.8,
},

dashboard: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginBottom: 15,
},

dashboardCard: {
  width: '25%',
  backgroundColor: '#14396E',
  borderRadius: 0,
  padding: 3,
  marginBottom: 1,
  alignItems: 'center',
},

dashboardNumero: {
  color: '#FFF',
  fontSize: 14,
  fontWeight: 'bold',
},

dashboardTitulo: {
  color: '#CCC',
  marginTop: 5,
  fontSize: 10,
},

});
