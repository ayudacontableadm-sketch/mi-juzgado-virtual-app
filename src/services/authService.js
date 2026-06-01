import { isMockAuthMode } from '../config/firebase';
import * as firebaseAuth from './auth/firebaseAuthAdapter';
import * as mockAuth from './auth/mockAuthAdapter';

export const DEVICE_LINKED_ERROR = 'Esta cuenta ya está vinculada a otro dispositivo. Contacta a soporte para cambiar de equipo.';
export { MOCK_SMS_CODE } from './auth/mockAuthAdapter';

const adapter = isMockAuthMode ? mockAuth : firebaseAuth;
export const authMode = isMockAuthMode ? 'mock' : 'firebase';

function friendlyError(error) {
  return error.message === 'DEVICE_ALREADY_LINKED' ? new Error(DEVICE_LINKED_ERROR) : error;
}

export const getCurrentUser = () => adapter.getCurrentUser();
export const logout = () => adapter.logout();
export const requestDeviceChange = (user, details) => adapter.requestDeviceChange(user, details);
export const setPhoneVerificationProvider = (provider) => firebaseAuth.setPhoneVerificationProvider(provider);

export async function sendPhoneCode(phone) {
  try {
    return await adapter.sendPhoneCode(phone);
  } catch (error) {
    throw friendlyError(error);
  }
}

export async function confirmPhoneCode(code) {
  try {
    return await adapter.confirmPhoneCode(code);
  } catch (error) {
    throw friendlyError(error);
  }
}

// Alias temporales para consumidores anteriores del prototipo.
export const sendSmsCode = sendPhoneCode;
export const verifySmsCode = (_verificationId, code) => confirmPhoneCode(code);
