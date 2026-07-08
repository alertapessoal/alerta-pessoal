import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from './api';

/*
|--------------------------------------------------------------------------
| Configuração de como as notificações aparecem em foreground
|--------------------------------------------------------------------------
*/

Notifications.setNotificationHandler({

  handleNotification: async () => ({

    shouldShowAlert: true,

    shouldPlaySound: true,

    shouldSetBadge: true,

  }),

});

/*
|--------------------------------------------------------------------------
| Registrar token de push e enviar para o backend
|--------------------------------------------------------------------------
*/

export async function registrarPushToken() {

  if (!Device.isDevice) {

    console.log(
      'Push notifications exigem um dispositivo físico.'
    );

    return;

  }

  /*
  ======================================
  CANAL ANDROID COM SOM/VIBRAÇÃO MÁXIMA
  ======================================
  */

  if (Platform.OS === 'android') {

    await Notifications.setNotificationChannelAsync(

      'mandados',

      {

        name: 'Mandados de prisão',

        importance: Notifications.AndroidImportance.MAX,

        vibrationPattern: [0, 500, 250, 500],

        lockscreenVisibility:

          Notifications.AndroidNotificationVisibility.PUBLIC,

        enableVibrate: true,

        showBadge: true,

      }

    );

  }

  /*
  ======================================
  SOLICITAR PERMISSÃO
  ======================================
  */

  const { status: statusExistente } =
    await Notifications.getPermissionsAsync();

  let statusFinal = statusExistente;

  if (statusExistente !== 'granted') {

    const { status } =
      await Notifications.requestPermissionsAsync();

    statusFinal = status;

  }

  if (statusFinal !== 'granted') {

    console.log(
      'Permissão de notificação não concedida.'
    );

    return;

  }

  /*
  ======================================
  OBTER TOKEN EXPO PUSH
  ======================================
  */

  const projectId =

    Constants.expoConfig?.extra?.eas?.projectId ??

    Constants.easConfig?.projectId;

  if (!projectId) {

    console.log(

      'projectId não encontrado em app.json/app.config (extra.eas.projectId). ' +

      'Configure-o para conseguir gerar o push token.'

    );

    return;

  }

  const tokenData =
    await Notifications.getExpoPushTokenAsync({

      projectId,

    });

  const pushToken = tokenData.data;

  /*
  ======================================
  ENVIAR TOKEN PARA O BACKEND
  ======================================
  */

  try {

    await api.post('/push/token', { pushToken });

  } catch (erro) {

    console.log(

      'Erro ao registrar push token:',

      erro

    );

  }

}

/*
|--------------------------------------------------------------------------
| Listener: quando o usuário toca na notificação, navega para os alertas
|--------------------------------------------------------------------------
*/

export function configurarListenerNotificacao(

  onAbrirAlertas: () => void

) {

  const subscription =

    Notifications.addNotificationResponseReceivedListener(

      () => {

        onAbrirAlertas();

      }

    );

  return () => subscription.remove();

}
