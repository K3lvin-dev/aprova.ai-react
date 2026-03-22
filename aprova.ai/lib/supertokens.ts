import SuperTokens from 'supertokens-react-native';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';
const SESSION_KEY = 'session_active';

export function initSuperTokens() {
  SuperTokens.init({
    apiDomain: API_URL,
    apiBasePath: '/auth',
  });
}

export async function doesSessionExist(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(SESSION_KEY);
  return value === 'true';
}

// SuperTokens backend API — chamadas diretas ao FastAPI
export const authApi = {
  signIn: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formFields: [
          { id: 'email', value: email },
          { id: 'password', value: password },
        ],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status === 'OK') {
      await SecureStore.setItemAsync(SESSION_KEY, 'true');
    }
    return data;
  },

  signUp: async (email: string, password: string, name: string) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formFields: [
          { id: 'email', value: email },
          { id: 'password', value: password },
          { id: 'name', value: name },
        ],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status === 'OK') {
      await SecureStore.setItemAsync(SESSION_KEY, 'true');
    }
    return data;
  },

  signOut: async () => {
    await fetch(`${API_URL}/auth/signout`, { method: 'POST' });
    await SecureStore.deleteItemAsync(SESSION_KEY);
  },
};
