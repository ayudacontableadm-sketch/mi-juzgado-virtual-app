import { PhoneAuthProvider, signInWithCredential, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { getDeviceId, getDeviceSummary } from './deviceService';
export const DEVICE_LINKED_ERROR = 'Esta cuenta ya está vinculada a otro dispositivo. Contacta a soporte para cambiar de equipo.';
export async function sendSmsCode(phoneNumber, recaptchaVerifier) {
  const provider = new PhoneAuthProvider(auth);
  return provider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);
}
export async function verifySmsCode(verificationId, code) {
  const credential = PhoneAuthProvider.credential(verificationId, code);
  const result = await signInWithCredential(auth, credential);
  await enforceSingleDevice(result.user);
  return result.user;
}
export async function enforceSingleDevice(user) {
  const deviceId = await getDeviceId();
  const ref = doc(db, 'users', user.uid);
  const snapshot = await getDoc(ref);
  const profile = snapshot.data();
  if (profile?.deviceId && profile.deviceId !== deviceId) {
    await signOut(auth);
    throw new Error(DEVICE_LINKED_ERROR);
  }
  await setDoc(ref, { uid: user.uid, phoneNumber: user.phoneNumber, registeredAt: profile?.registeredAt ?? serverTimestamp(), deviceId, deviceName: getDeviceSummary(), accountStatus: 'active', updatedAt: serverTimestamp() }, { merge: true });
  return deviceId;
}
export async function requestDeviceChange(user, details = '') {
  const deviceId = await getDeviceId();
  await setDoc(doc(db, 'deviceChangeRequests', `${user.uid}-${Date.now()}`), { uid: user.uid, phoneNumber: user.phoneNumber, requestedDeviceId: deviceId, requestedDeviceName: getDeviceSummary(), details, status: 'pending', createdAt: serverTimestamp() });
}
// Producción: reforzar la regla de dispositivo único con Firebase App Check,
// tokens de sesión revocables y validaciones autoritativas en backend/Cloud Functions.
