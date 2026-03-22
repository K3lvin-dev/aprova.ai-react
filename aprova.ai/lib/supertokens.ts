import SuperTokens from 'supertokens-react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export function initSuperTokens() {
  SuperTokens.init({
    apiDomain: API_URL,
    apiBasePath: '/auth',
  });
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
    return res.json();
  },

  signUp: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formFields: [
          { id: 'email', value: email },
          { id: 'password', value: password },
        ],
      }),
    });
    return res.json();
  },

  signOut: async () => {
    await fetch(`${API_URL}/auth/signout`, { method: 'POST' });
  },
};
