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

export default function TermosScreen() {
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
          Termos de Uso
        </Text>

        <View style={{ width: 32 }} />
      </View>

     
      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.card}>

          <Text style={styles.topico}>
            1. Sobre o serviço
          </Text>

          <Text style={styles.texto}>
            O Alerta Pessoal é uma plataforma que realiza consultas públicas para identificar mandados de prisão vinculados ao CPF informado.
          </Text>

          <Text style={styles.topico}>
            2. Uso do serviço
          </Text>

          <Text style={styles.texto}>
            O usuário se compromete a utilizar o serviço de forma lícita, não podendo utilizá-lo para fins ilegais ou que violem direitos de terceiros.
          </Text>

          <Text style={styles.topico}>
            3. Responsabilidades
          </Text>

          <Text style={styles.texto}>
            As informações exibidas são baseadas em dados públicos e podem sofrer alterações. Não garantimos 100% de precisão das informações obtidas.
          </Text>

          <Text style={styles.topico}>
            4. Assinatura e pagamento
          </Text>

          <Text style={styles.texto}>
            A assinatura é anual e o cancelamento pode ser realizado a qualquer momento. Não há reembolso proporcional.
          </Text>

        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => router.back()}
        >
          <Text style={styles.botaoTexto}>
            VOLTAR
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
    fontSize: 28,
    fontWeight: 'bold',
  },

  dataAtualizacao: {
    color: '#B8C7E0',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 20,
  },

  card: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 20,
    padding: 20,
  },

  topico: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 15,
  },

  texto: {
    color: '#FFF',
    fontSize: 18,
    lineHeight: 28,
  },

  botao: {
    backgroundColor: '#F5B800',
    padding: 18,
    borderRadius: 15,
    marginTop: 25,
    marginBottom: 30,
  },

  botaoTexto: {
    textAlign: 'center',
    color: '#031B4E',
    fontSize: 24,
    fontWeight: 'bold',
  },

});