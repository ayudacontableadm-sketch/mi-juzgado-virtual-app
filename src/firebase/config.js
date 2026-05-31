import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId,
};

// Expo Go MVP: no inicializar el SDK web de Firebase desde este módulo. Las
// implementaciones Firebase reales deben aislarse en un development build para
// que el SDK no se incluya en el bundle inicial compatible con Expo Go.
