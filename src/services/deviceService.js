import * as Application from 'expo-application';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
const LOCAL_DEVICE_KEY = 'mi-juzgado-virtual-device-id';
const fallbackId = () => `mjav-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export async function getDeviceId() {
  const existing = await SecureStore.getItemAsync(LOCAL_DEVICE_KEY);
  if (existing) return existing;
  const nativeId = Application.getAndroidId?.() || (await Application.getIosIdForVendorAsync?.()) || Device.osBuildId;
  const deviceId = nativeId || fallbackId();
  await SecureStore.setItemAsync(LOCAL_DEVICE_KEY, deviceId);
  return deviceId;
}
export const getDeviceSummary = () => `${Device.manufacturer ?? ''} ${Device.modelName ?? 'Dispositivo móvil'}`.trim();
