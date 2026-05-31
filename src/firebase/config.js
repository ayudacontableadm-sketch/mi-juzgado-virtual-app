import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};
const environment = {
  firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  firebaseAuthMode: process.env.EXPO_PUBLIC_AUTH_MODE,
};
const pick = (key, fallback = '') => environment[key] || extra[key] || fallback;

export const firebaseConfig = {
  apiKey: pick('firebaseApiKey'),
  authDomain: pick('firebaseAuthDomain'),
  projectId: pick('firebaseProjectId'),
  storageBucket: pick('firebaseStorageBucket'),
  messagingSenderId: pick('firebaseMessagingSenderId'),
  appId: pick('firebaseAppId'),
};

export const authMode = pick('firebaseAuthMode', 'mock').toLowerCase();
export const isMockAuthMode = authMode !== 'firebase';

export function assertFirebaseConfigured() {
  const required = ['apiKey', 'projectId'];
  const missing = required.filter((key) => !firebaseConfig[key] || firebaseConfig[key].startsWith('YOUR_'));
  if (missing.length) throw new Error(`Falta configurar Firebase: ${missing.join(', ')}.`);
}

export function getIdentityToolkitUrl(action) {
  assertFirebaseConfigured();
  return `https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${firebaseConfig.apiKey}`;
}

export function getFirestoreDocumentUrl(path) {
  assertFirebaseConfigured();
  return `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${path}`;
}
