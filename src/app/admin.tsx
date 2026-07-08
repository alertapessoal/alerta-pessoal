import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AdminScreen() {

  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={32}
          color="#FFF"
        />
      </TouchableOpacity>

      <Text style={styles.titulo}>
        Painel Administrativo
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push('/admindashboard')
          }
        >
          <Ionicons
            name="stats-chart-outline"
            size={32}
            color="#FFF"
          />

          <Text style={styles.texto}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push('/adminusuarios')
          }
        >
          <Ionicons
            name="people-outline"
            size={32}
            color="#FFF"
          />

          <Text style={styles.texto}>
            Usuários
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push('/adminsaques')
          }
        >
          <Ionicons
            name="wallet-outline"
            size={32}
            color="#FFF"
          />

          <Text style={styles.texto}>
            Administração de Saques
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push('/admincomissoes')
          }
        >
          <Ionicons
            name="cash-outline"
            size={32}
            color="#FFF"
          />

          <Text style={styles.texto}>
            Administração de Comissões
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push('/adminafiliados')
          }
        >
          <Ionicons
            name="trophy-outline"
            size={32}
            color="#FFF"
          />

          <Text style={styles.texto}>
            Ranking de Afiliados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push('/adminconversao')
          }
        >
          <Ionicons
            name="analytics-outline"
            size={32}
            color="#FFF"
          />

          <Text style={styles.texto}>
            Conversão dos Afiliados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push('/admincalendario')
          }
        >
          <Ionicons
            name="calendar-outline"
            size={32}
            color="#FFF"
          />

          <Text style={styles.texto}>
            Calendário Financeiro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push('/adminplanos')
          }
        >
          <Ionicons
            name="layers-outline"
            size={32}
            color="#FFF"
          />

          <Text style={styles.texto}>
            Receita por Plano
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push('/adminfinanceiro')
          }
        >
          <Ionicons
            name="bar-chart-outline"
            size={32}
            color="#FFF"
          />

          <Text style={styles.texto}>
            Fluxo Financeiro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push('/admincrescimento')
          }
        >
          <Ionicons
            name="trending-up-outline"
            size={32}
            color="#FFF"
          />

          <Text style={styles.texto}>
            Crescimento Mensal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push('/adminauditoria')
          }
        >
          <Ionicons
            name="document-text-outline"
            size={32}
            color="#FFF"
          />

          <Text style={styles.texto}>
            Auditoria
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 25,
  },

  card: {
    backgroundColor: '#14396E',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderWidth: 1,
    borderColor: '#1F6FE5',
  },

  texto: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

});