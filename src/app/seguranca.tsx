import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SegurancaScreen() {
  const [biometria, setBiometria] = useState(true);
  const [duasEtapas, setDuasEtapas] = useState(true);
  const [encerrarSessoes, setEncerrarSessoes] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.header}>
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
            Segurança
          </Text>

          <View style={{ width: 32 }} />
        </View>

        <Text style={styles.subtitulo}>
          Gerencie sua senha e configure opções para proteger sua conta.
        </Text>

        <View style={styles.card}>

          <Text style={styles.cardTitulo}>
            Alterar senha
          </Text>

          <Text style={styles.label}>
            Senha atual
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha atual"
            placeholderTextColor="#7C8BA3"
            secureTextEntry
          />

          <Text style={styles.label}>
            Nova senha
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite sua nova senha"
            placeholderTextColor="#7C8BA3"
            secureTextEntry
          />

          <Text style={styles.label}>
            Confirmar nova senha
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Confirme sua nova senha"
            placeholderTextColor="#7C8BA3"
            secureTextEntry
          />

          <View style={styles.requisitos}>
            <Text style={styles.reqTitulo}>
              A senha deve conter:
            </Text>

            <Text style={styles.req}>
              ✓ Mínimo 8 caracteres
            </Text>

            <Text style={styles.req}>
              ✓ Pelo menos 1 número
            </Text>

            <Text style={styles.req}>
              ✓ Pelo menos 1 letra maiúscula
            </Text>

            <Text style={styles.req}>
              ✓ Pelo menos 1 caractere especial
            </Text>
          </View>

        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitulo}>
            Proteção da conta
          </Text>

          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitulo}>
                Biometria
              </Text>

              <Text style={styles.itemTexto}>
                Use sua digital para acessar o aplicativo.
              </Text>
            </View>

            <Switch
              value={biometria}
              onValueChange={setBiometria}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitulo}>
                Autenticação em duas etapas
              </Text>

              <Text style={styles.itemTexto}>
                Receba um código de verificação além da senha.
              </Text>
            </View>

            <Switch
              value={duasEtapas}
              onValueChange={setDuasEtapas}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitulo}>
                Encerrar sessões
              </Text>

              <Text style={styles.itemTexto}>
                Desconectar dispositivos ativos.
              </Text>
            </View>

            <Switch
              value={encerrarSessoes}
              onValueChange={setEncerrarSessoes}
            />
          </View>

        </View>

        <TouchableOpacity
          style={styles.botao}
        >
          <Text style={styles.botaoTexto}>
            ATUALIZAR SENHA
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
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 20,
  },

  card: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  cardTitulo: {
    color: '#f5d90a',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  label: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 12,
    padding: 15,
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
  },

  requisitos: {
    borderWidth: 1,
    borderColor: '#14396E',
    borderRadius: 15,
    padding: 15,
    marginTop: 15,
  },

  reqTitulo: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },

  req: {
    color: '#39D353',
    fontSize: 16,
    marginBottom: 8,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemTitulo: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  itemTexto: {
    color: '#B8C7E0',
    fontSize: 15,
    marginTop: 5,
    width: 230,
  },

  divider: {
    height: 1,
    backgroundColor: '#14396E',
    marginVertical: 20,
  },

  botao: {
    backgroundColor: '#F5B800',
    borderRadius: 15,
    padding: 18,
    marginBottom: 30,
  },

  botaoTexto: {
    color: '#031B4E',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },

});