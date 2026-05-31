import { getFirestoreDocumentUrl, getIdentityToolkitUrl } from '../../firebase/config';
import { getDeviceId, getDeviceSummary } from '../deviceService';

let currentUser = null;
let sessionInfo = null;
let phoneVerificationProvider = null;

function firebaseValue(value) {
  if (typeof value === 'string') return { stringValue: value };
  throw new Error('Tipo de dato Firestore no soportado.');
}

async function parseResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message || 'Firebase no pudo completar la solicitud.');
  return body;
}

async function identityRequest(action, body) {
  return parseResponse(await fetch(getIdentityToolkitUrl(action), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
}

async function firestoreRequest(path, idToken, options = {}) {
  return fetch(getFirestoreDocumentUrl(path), {
    ...options,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

export function setPhoneVerificationProvider(provider) {
  phoneVerificationProvider = provider;
}

export function getCurrentUser() {
  return currentUser;
}

export async function sendPhoneCode(phoneNumber) {
  if (!phoneVerificationProvider) {
    throw new Error('El envío SMS real requiere un development build con un proveedor de verificación nativo. Usa EXPO_PUBLIC_AUTH_MODE=mock en Expo Go.');
  }
  const verificationProof = await phoneVerificationProvider(phoneNumber);
  const result = await identityRequest('sendVerificationCode', { phoneNumber, ...verificationProof });
  sessionInfo = result.sessionInfo;
  return { verificationId: sessionInfo, mode: 'firebase' };
}

export async function confirmPhoneCode(code) {
  if (!sessionInfo) throw new Error('Solicita un código SMS antes de continuar.');
  const result = await identityRequest('signInWithPhoneNumber', { sessionInfo, code });
  const user = { uid: result.localId, phoneNumber: result.phoneNumber, idToken: result.idToken };
  try {
    await enforceSingleDevice(user);
    currentUser = user;
    sessionInfo = null;
    return user;
  } catch (error) {
    await logout();
    throw error;
  }
}

export async function enforceSingleDevice(user) {
  const deviceId = await getDeviceId();
  const response = await firestoreRequest(`users/${user.uid}`, user.idToken);
  if (response.ok) {
    const profile = await response.json();
    if (profile.fields?.deviceId?.stringValue !== deviceId) throw new Error('DEVICE_ALREADY_LINKED');
    return profile;
  }
  if (response.status !== 404) await parseResponse(response);
  const createdAt = new Date().toISOString();
  const profile = {
    fields: {
      uid: firebaseValue(user.uid),
      phoneNumber: firebaseValue(user.phoneNumber),
      createdAt: { timestampValue: createdAt },
      deviceId: firebaseValue(deviceId),
      deviceName: firebaseValue(getDeviceSummary()),
      accountStatus: firebaseValue('active'),
    },
  };
  await parseResponse(await firestoreRequest(`users/${user.uid}`, user.idToken, { method: 'PATCH', body: JSON.stringify(profile) }));
  return profile;
}

export async function logout() {
  currentUser = null;
  sessionInfo = null;
}

export async function requestDeviceChange(user, details = '') {
  const requestId = `${user.uid}-${Date.now()}`;
  const request = {
    fields: {
      uid: firebaseValue(user.uid),
      phoneNumber: firebaseValue(user.phoneNumber),
      requestedDeviceId: firebaseValue(await getDeviceId()),
      requestedDeviceName: firebaseValue(getDeviceSummary()),
      details: firebaseValue(details),
      status: firebaseValue('pending'),
      createdAt: { timestampValue: new Date().toISOString() },
    },
  };
  await parseResponse(await firestoreRequest(`deviceChangeRequests/${requestId}`, user.idToken, { method: 'PATCH', body: JSON.stringify(request) }));
  return { id: requestId, ...request };
}
