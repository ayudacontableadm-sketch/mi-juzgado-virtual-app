import { getDeviceId, getDeviceSummary } from './deviceService';

export const DEVICE_LINKED_ERROR = 'Esta cuenta ya está vinculada a otro dispositivo. Contacta a soporte para cambiar de equipo.';
export const MOCK_SMS_CODE = '123456';

let currentUser = null;
const profiles = new Map();
const deviceChangeRequests = [];

export function getCurrentUser() {
  return currentUser;
}

export async function sendSmsCode(phoneNumber) {
  return `mock-verification:${phoneNumber}:${Date.now()}`;
}

export async function verifySmsCode(verificationId, code) {
  if (!verificationId?.startsWith('mock-verification:')) {
    throw new Error('Solicita un código SMS antes de continuar.');
  }
  if (code !== MOCK_SMS_CODE) {
    throw new Error(`Para esta demo usa el código ${MOCK_SMS_CODE}.`);
  }
  const [, phoneNumber] = verificationId.split(':');
  const user = { uid: `demo-${phoneNumber.replace(/\D/g, '')}`, phoneNumber };
  await enforceSingleDevice(user);
  currentUser = user;
  return user;
}

export async function enforceSingleDevice(user) {
  const deviceId = await getDeviceId();
  const profile = profiles.get(user.uid);
  if (profile?.deviceId && profile.deviceId !== deviceId) {
    currentUser = null;
    throw new Error(DEVICE_LINKED_ERROR);
  }
  profiles.set(user.uid, {
    ...profile,
    uid: user.uid,
    phoneNumber: user.phoneNumber,
    registeredAt: profile?.registeredAt ?? new Date().toISOString(),
    deviceId,
    deviceName: getDeviceSummary(),
    accountStatus: 'active',
    updatedAt: new Date().toISOString(),
  });
  return deviceId;
}

export async function requestDeviceChange(user, details = '') {
  const deviceId = await getDeviceId();
  const request = {
    id: `${user.uid}-${Date.now()}`,
    uid: user.uid,
    phoneNumber: user.phoneNumber,
    requestedDeviceId: deviceId,
    requestedDeviceName: getDeviceSummary(),
    details,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  deviceChangeRequests.push(request);
  return request;
}

// MVP Expo Go: este servicio es un mock local deliberado. La integración real
// de Firebase Phone Auth y Firestore debe vivir detrás de una implementación
// separada que solo se cargue en un development build compatible.
