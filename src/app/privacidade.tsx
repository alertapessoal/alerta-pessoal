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

export default function PrivacidadeScreen() {
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
          Política de Privacidade
        </Text>

        <View style={{ width: 32 }} />
      </View>

    
      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.card}>

          <Text style={styles.topico}>
            1. Coleta de dados
          </Text>

          <Text style={styles.texto}>
            Coletamos apenas os dados necessários para prestar o serviço: CPF, nome, e-mail e dados de pagamento.
          </Text>

          <Text style={styles.topico}>
            2. Uso das informações
          </Text>

          <Text style={styles.texto}>
            Seus dados são utilizados exclusivamente para monitoramento, envio de alertas e melhoria da experiência.
          </Text>

          <Text style={styles.topico}>
            3. Compartilhamento
          </Text>

          <Text style={styles.texto}>
            Não compartilhamos seus dados pessoais com terceiros, exceto quando exigido por lei.
          </Text>

          <Text style={styles.topico}>
            4. Segurança
          </Text>

          <Text style={styles.texto}>
            Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos não autorizados.
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  titulo: {
    color: '#FFF',
    fontSize: 24,
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
    marginTop: 20,
    marginBottom: 10,
  },

  texto: {
    color: '#FFF',
    fontSize: 18,
    lineHeight: 30,
  },

  botao: {
    backgroundColor: '#F5B800',
    padding: 18,
    borderRadius: 15,
    marginTop: 25,
    marginBottom: 30,
  },

  botaoTexto: {
    color: '#031B4E',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },

});