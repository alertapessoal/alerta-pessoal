import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function NotificacoesScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={32}
            color="#FFF"
          />
        </TouchableOpacity>

        <Text style={styles.titulo}>
          Notificações
        </Text>

        <View style={{ width: 32 }} />
      </View>

      <Text style={styles.subtitulo}>
        Configure como deseja receber os alertas.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.card}>

          <Text style={styles.cardTitulo}>
            Recebimento de alertas
          </Text>

          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitulo}>
                Notificação push
              </Text>
              <Text style={styles.itemDescricao}>
                Receber alertas diretamente no celular.
              </Text>
            </View>

            <Switch value={true} />
          </View>

          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitulo}>
                Notificação sonora
              </Text>
              <Text style={styles.itemDescricao}>
                Reproduzir som ao receber alertas.
              </Text>
            </View>

            <Switch value={true} />
          </View>

          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitulo}>
                Vibração
              </Text>
              <Text style={styles.itemDescricao}>
                Vibrar o aparelho ao receber alertas.
              </Text>
            </View>

            <Switch value={true} />
          </View>

        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitulo}>
            Alertas disponíveis
          </Text>

          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitulo}>
                Mandado de prisão
              </Text>

              <Text style={styles.itemDescricao}>
                Notificar quando for identificado mandado vinculado ao CPF.
              </Text>
            </View>

            <View style={styles.bolinhaAtivaContainer}>
              <View style={styles.bolinhaAtiva} />
            </View>
          </View>

        </View>

        <TouchableOpacity style={styles.botao}>
          <Text style={styles.botaoTexto}>
            SALVAR CONFIGURAÇÕES
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
  },

  titulo: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitulo: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  itemTitulo: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  itemDescricao: {
    color: '#D0D0D0',
    fontSize: 14,
    maxWidth: 240,
  },

  bolinhaAtivaContainer: {
    width: 51,
    alignItems: 'center',
  },

  bolinhaAtiva: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#39D353',
  },

  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },

  opcaoTexto: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  botao: {
    backgroundColor: '#F5B800',
    borderRadius: 15,
    padding: 18,
    marginTop: 10,
    marginBottom: 30,
  },

  botaoTexto: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#031B4E',
  },

});
