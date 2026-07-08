import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { nome, cpf, email } = useLocalSearchParams();
console.log('PARAMS RECEBIDOS:', useLocalSearchParams());
  console.log('NOME:', nome);
  console.log('CPF:', cpf);
  console.log('EMAIL:', email);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Olá, {nome || 'Usuário'}
      </Text>

      <Text style={styles.texto}>
        CPF: {cpf}
      </Text>

      <Text style={styles.texto}>
        E-mail: {email}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031B4E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  titulo: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  texto: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
});