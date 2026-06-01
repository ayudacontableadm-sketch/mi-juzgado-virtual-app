import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../components/AppButton';
import ScreenContainer from '../components/ScreenContainer';
import { authMode, confirmPhoneCode, DEVICE_LINKED_ERROR, sendPhoneCode } from '../services/authService';
import { colors, radii, spacing, typography } from '../theme/theme';

export default function PhoneAuthScreen({ navigation, mode = 'login' }) {
  const [phone, setPhone] = useState('+52 ');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [deviceLockMessage, setDeviceLockMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const register = mode === 'register';

  function updatePhone(value) {
    setPhone(value);
    setCode('');
    setCodeSent(false);
  }

  async function sendCode() {
    if (phone.replace(/\D/g, '').length < 12) return Alert.alert('Número incompleto', 'Ingresa tu número con lada y código de país.');
    try {
      setLoading(true);
      setDeviceLockMessage('');
      await sendPhoneCode(phone.replace(/\s/g, ''));
      setCodeSent(true);
      if (authMode === 'mock') Alert.alert('Código de demostración', 'Expo Go usa autenticación local temporal. Ingresa el código 123456.');
      else Alert.alert('Código enviado', 'Revisa el SMS enviado a tu celular.');
    } catch (error) {
      Alert.alert('No se pudo enviar el SMS', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    if (code.length < 6) return Alert.alert('Código incompleto', 'Ingresa el código de 6 dígitos enviado por SMS.');
    try {
      setLoading(true);
      setDeviceLockMessage('');
      await confirmPhoneCode(code);
      navigation.replace('Dashboard');
    } catch (error) {
      if (error.message === DEVICE_LINKED_ERROR) setDeviceLockMessage(error.message);
      Alert.alert('No se pudo iniciar sesión', error.message);
    } finally {
      setLoading(false);
    }
  }

  return <ScreenContainer>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardArea}>
      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View>
      <Text style={styles.eyebrow}>MI JUZGADO VIRTUAL</Text>
      <Text style={styles.title}>{register ? 'Crea tu cuenta' : 'Inicia sesión'}</Text>
      <Text style={styles.copy}>{register ? 'Regístrate con tu número celular. Te enviaremos un código de verificación por SMS.' : 'Ingresa tu celular para revalidar tu acceso de forma segura por SMS.'}</Text>
      {authMode === 'mock' && <Text style={styles.mockNotice}>Modo Expo Go: el SMS es simulado y el código de prueba es 123456.</Text>}
      {!!deviceLockMessage && <Text style={styles.lockMessage}>{deviceLockMessage}</Text>}
    </View>
    <View style={styles.form}>
      <Text style={styles.label}>Número de celular</Text>
      <TextInput accessibilityLabel="Número de celular" value={phone} onChangeText={updatePhone} keyboardType="phone-pad" style={styles.input} placeholder="+52 55 1234 5678" />
      {codeSent && <>
        <Text style={styles.label}>Código SMS</Text>
        <TextInput accessibilityLabel="Código SMS" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} style={styles.input} placeholder="000000" />
      </>}
      <AppButton loading={loading} title={codeSent ? 'Verificar código' : 'Enviar código SMS'} onPress={codeSent ? verify : sendCode} />
      {codeSent && <Text onPress={sendCode} style={styles.resend}>Reenviar código SMS</Text>}
      <AppButton variant="secondary" title="Entrar a demo navegable" onPress={() => navigation.replace('Dashboard')} />
    </View>
    <Text style={styles.bottom}>{register ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'} <Text onPress={() => navigation.replace(register ? 'Login' : 'Register')} style={styles.link}>{register ? 'Iniciar sesión' : 'Registrarme'}</Text></Text>
      </ScrollView>
    </KeyboardAvoidingView>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  keyboardArea: { flex: 1 },
  screen: { flexGrow: 1, padding: spacing.xl, justifyContent: 'space-between', gap: spacing.xl },
  eyebrow: { ...typography.small, color: colors.teal, fontWeight: '800', marginTop: spacing.lg },
  title: { ...typography.h1, color: colors.ink, marginTop: spacing.sm },
  copy: { ...typography.body, color: colors.muted, marginTop: spacing.md },
  mockNotice: { ...typography.small, color: colors.teal, marginTop: spacing.md, fontWeight: '700' },
  lockMessage: { ...typography.body, color: colors.danger ?? '#B42318', marginTop: spacing.md, fontWeight: '700' },
  form: { gap: spacing.md },
  label: { ...typography.small, color: colors.ink, fontWeight: '700' },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, ...typography.body, color: colors.ink },
  resend: { ...typography.small, color: colors.teal, fontWeight: '800', textAlign: 'center', paddingVertical: spacing.xs },
  bottom: { ...typography.body, textAlign: 'center', color: colors.text, paddingBottom: spacing.md },
  link: { color: colors.teal, fontWeight: '800' },
});
