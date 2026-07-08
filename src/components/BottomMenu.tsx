import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function BottomMenu() {
  const pathname = usePathname();

  return (
    <View style={styles.bottomMenu}>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push('/principal')}
      >
        <Ionicons
          name="home"
          size={28}
          color={
            pathname === '/principal'
              ? '#F5B800'
              : '#FFF'
          }
        />

        <Text
          style={
            pathname === '/principal'
              ? styles.menuAtivo
              : styles.menu
          }
        >
          Painel
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push('/alertas')}
      >
        <Ionicons
          name="notifications-outline"
          size={28}
          color={
            pathname === '/alertas'
              ? '#F5B800'
              : '#FFF'
          }
        />

        <Text
          style={
            pathname === '/alertas'
              ? styles.menuAtivo
              : styles.menu
          }
        >
          Alertas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push('/historico')}
      >
        <Ionicons
          name="time-outline"
          size={28}
          color={
            pathname === '/historico'
              ? '#F5B800'
              : '#FFF'
          }
        />

        <Text
          style={
            pathname === '/historico'
              ? styles.menuAtivo
              : styles.menu
          }
        >
          Histórico
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push('/perfil')}
      >
        <Ionicons
          name="person-outline"
          size={28}
          color={
            pathname === '/perfil'
              ? '#F5B800'
              : '#FFF'
          }
        />

        <Text
          style={
            pathname === '/perfil'
              ? styles.menuAtivo
              : styles.menu
          }
        >
          Perfil
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    paddingTop: 10,
    paddingBottom: 25,

    borderTopWidth: 1,
    borderTopColor: '#14396E',

    backgroundColor: '#031B4E',
  },

  menuButton: {
    alignItems: 'center',
  },

  menu: {
    color: '#FFF',
    marginTop: 5,
  },

  menuAtivo: {
    color: '#F5B800',
    marginTop: 5,
    fontWeight: 'bold',
  },
});