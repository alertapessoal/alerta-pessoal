import * as SecureStore from 'expo-secure-store';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const TOKEN_KEY = 'token';

export class ApiError extends Error {}

async function obterToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

async function chamarApi(
  caminho: string,
  opcoes: {
    metodo?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    corpo?: any;
    autenticado?: boolean;
  } = {}
) {
  const { metodo = 'GET', corpo, autenticado = true } = opcoes;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (autenticado) {
    const token = await obterToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const resposta = await fetch(`${API_URL}${caminho}`, {
    method: metodo,
    headers,
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new ApiError(dados?.erro || 'Erro ao comunicar com o servidor.');
  }

  return dados;
}

export const api = {
  get: (caminho: string, autenticado = true) =>
    chamarApi(caminho, { metodo: 'GET', autenticado }),

  post: (caminho: string, corpo?: any, autenticado = true) =>
    chamarApi(caminho, { metodo: 'POST', corpo, autenticado }),

  put: (caminho: string, corpo?: any, autenticado = true) =>
    chamarApi(caminho, { metodo: 'PUT', corpo, autenticado }),
};

export async function salvarSessao(token: string, usuario: any) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync('usuarioLogado', JSON.stringify(usuario));
}

export async function limparSessao() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync('usuarioLogado');
}

export async function obterUsuarioLogado() {
  const dados = await SecureStore.getItemAsync('usuarioLogado');
  return dados ? JSON.parse(dados) : null;
}
