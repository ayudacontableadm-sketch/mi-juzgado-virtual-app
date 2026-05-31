import { getDeviceId, getDeviceSummary } from '../deviceService';

export const MOCK_SMS_CODE = '123456';
let currentUser = null;
let pendingPhoneNumber = null;
const profiles = new Map();
const deviceChangeRequests = [];

export function getCurrentUser() {
  return currentUser;
}

export async function sendPhoneCode(phoneNumber) {
  pendingPhoneNumber = phoneNumber;
  return { verificationId: `mock-verification:${Date.now()}`, mode: 'mock' };
}

export async function confirmPhoneCode(code) {
  if (!pendingPhoneNumber) throw new Error('Solicita un código SMS antes de continuar.');
  if (code !== MOCK_SMS_CODE) throw new Error(`Para esta demo usa el código ${MOCK_SMS_CODE}.`);
  const phoneNumber = pendingPhoneNumber;
  const user = { uid: `demo-${phoneNumber.replace(/\D/g, '')}`, phoneNumber };
  await enforceSingleDevice(user);
  currentUser = user;
  pendingPhoneNumber = null;
  return user;
}

export async function enforceSingleDevice(user) {
  const deviceId = await getDeviceId();
  const profile = profiles.get(user.uid);
  if (profile?.deviceId && profile.deviceId !== deviceId) throw new Error('DEVICE_ALREADY_LINKED');
  profiles.set(user.uid, {
    uid: user.uid,
    phoneNumber: user.phoneNumber,
    createdAt: profile?.createdAt ?? new Date().toISOString(),
    deviceId,
    deviceName: getDeviceSummary(),
    accountStatus: profile?.accountStatus ?? 'active',
  });
  return profiles.get(user.uid);
}

export async function logout() {
  currentUser = null;
  pendingPhoneNumber = null;
}

export async function requestDeviceChange(user, details = '') {
  const request = {
    id: `${user.uid}-${Date.now()}`,
    uid: user.uid,
    phoneNumber: user.phoneNumber,
    requestedDeviceId: await getDeviceId(),
    requestedDeviceName: getDeviceSummary(),
    details,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  deviceChangeRequests.push(request);
  return request;
}
