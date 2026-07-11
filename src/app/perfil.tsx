import { logger } from '../lib/logger';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomMenu from '../components/BottomMenu';
import { limparSessao } from '../lib/api';

export default function PerfilScreen() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      const dados = await AsyncStorage.getItem(
        'usuarioLogado'
      );

      if (dados) {
        setUsuario(JSON.parse(dados));
      }
    } catch (error) {
      logger.log(error);
    }
  };

  const sairDaConta = async () => {
    try {
      await limparSessao();

      router.replace('/login');
    } catch (error) {
      logger.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >

        <View style={styles.header}>

          <Ionicons
            name="shield-checkmark"
            size={90}
            color="#F5B800"
          />

          <View style={styles.notification}>
            <Ionicons
              name="notifications-outline"
              size={28}
              color="#FFF"
            />

            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                2
              </Text>
            </View>
          </View>

        </View>

        <Text style={styles.titulo}>
          {usuario?.nome || 'Meu Perfil'}
        </Text>

        <Text style={styles.cpf}>
          CPF: {usuario?.cpf || 'Carregando...'}
        </Text>

        <View style={styles.card}>

          <MenuItem
            icon="person-outline"
            texto="Dados cadastrais"
            onPress={() =>
              router.push('/dadoscadastrais')
            }
          />

          <MenuItem
            icon="notifications-outline"
            texto="Notificações"
            onPress={() =>
              router.push('/notificacao')
            }
          />

          <MenuItem
            icon="star"
            texto="Assinatura"
            destaque
            onPress={() =>
              router.push('/assinatura')
            }
          />

          <MenuItem
            icon="people-outline"
            texto="Programa de Afiliados"
            onPress={() =>
              router.push('/afiliados')
            }
          />

{usuario?.admin && (
  <MenuItem
    icon="shield-checkmark-outline"
    texto="Painel Administrativo"
    destaque
    onPress={() =>
      router.push('/admin')
    }
  />
)}

<MenuItem
  icon="cash-outline"
  texto="Minhas Comissões"
  onPress={() =>
   router.push('/comissoes' as any)
  }
/>

          <MenuItem
            icon="wallet-outline"
            texto="Solicitar saque"
            onPress={() =>
              router.push('/saque')
            }
          />
<MenuItem
  icon="document-text-outline"
  texto="Histórico de Saques"
  onPress={() =>
    router.push('/saqueshistorico' as any)
  }
/>
          <MenuItem
            icon="lock-closed-outline"
            texto="Segurança"
            onPress={() =>
              router.push('/seguranca')
            }
          />

          <MenuItem
            icon="document-text-outline"
            texto="Termos de uso"
            onPress={() =>
              Linking.openURL('https://alertapessoal.com.br/termos-de-uso')
            }
          />

          <MenuItem
            icon="folder-open-outline"
            texto="Política de Privacidade"
            onPress={() =>
              Linking.openURL('https://alertapessoal.com.br/politica-de-privacidade')
            }
          />

        </View>

        <TouchableOpacity
          style={styles.sairCard}
          onPress={sairDaConta}
        >
          <Ionicons
            name="log-out-outline"
            size={28}
            color="#FF3B3B"
          />

          <Text style={styles.sairTexto}>
            Sair da conta
          </Text>
        </TouchableOpacity>

      </ScrollView>

      <BottomMenu />

    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  texto,
  destaque = false,
  onPress,
}: {
  icon: any;
  texto: string;
  destaque?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
    >

      <View style={styles.leftSide}>
        <Ionicons
          name={icon}
          size={28}
          color={destaque ? '#F5B800' : '#FFF'}
        />

        <Text style={styles.itemTexto}>
          {texto}
        </Text>
      </View>

      <View style={styles.rightSide}>

        <Ionicons
          name="chevron-forward"
          size={24}
          color="#FFF"
        />

      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031B4E',
    padding: 20,
  },

  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  notification: {
    position: 'absolute',
    right: 0,
    top: 0,
  },

  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
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
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  cpf: {
    color: '#FFF',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 25,
  },

  card: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 20,
    overflow: 'hidden',
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#14396E',
  },

  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemTexto: {
    color: '#FFF',
    fontSize: 18,
    marginLeft: 15,
  },


  sairCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },

  sairTexto: {
    color: '#FF3B3B',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
  },
});

