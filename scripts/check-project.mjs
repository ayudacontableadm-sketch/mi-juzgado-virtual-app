import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const required = [
  'App.js', 'app.json', 'babel.config.js', 'firestore.rules',
  'src/services/aiService.js', 'src/services/legalKnowledgeService.js', 'src/services/authService.js', 'src/services/auth/mockAuthAdapter.js', 'src/services/auth/firebaseAuthAdapter.js', 'src/services/hearingService.js',
  'src/firebase/config.js', 'src/components/AppButton.js', 'src/components/AppCard.js',
  'src/screens/WelcomeScreen.js', 'src/screens/LoginScreen.js', 'src/screens/RegisterScreen.js', 'src/screens/DashboardScreen.js',
  'src/screens/CaseInfoScreen.js', 'src/screens/HearingRoomScreen.js', 'src/screens/ProfileScreen.js'
];
const missing = required.filter((file) => !existsSync(file));
if (missing.length) throw new Error(`Missing files: ${missing.join(', ')}`);

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
for (const dependency of ['expo', '@react-navigation/native', 'expo-application', 'expo-device']) {
  if (!pkg.dependencies[dependency]) throw new Error(`Missing dependency: ${dependency}`);
}
if (pkg.dependencies.firebase) throw new Error('Firebase web SDK must not be bundled in the Expo Go MVP.');
if (!pkg.dependencies.expo.startsWith('^54.')) throw new Error('Expo Go MVP must use Expo SDK 54.');
if (pkg.dependencies.react !== '19.1.0') throw new Error('Expo SDK 54 must use React 19.1.0.');
if (!pkg.dependencies['react-native'].startsWith('0.81.')) throw new Error('Expo SDK 54 must use React Native 0.81.x.');

const babelConfig = readFileSync('babel.config.js', 'utf8');
if (!babelConfig.includes('babel-preset-expo')) throw new Error('babel.config.js must use babel-preset-expo.');

function listJavaScriptFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listJavaScriptFiles(path) : path.endsWith('.js') ? [path] : [];
  });
}
const sourceFiles = ['App.js', ...listJavaScriptFiles('src')];
const unsafeFirebaseImports = sourceFiles.filter((file) => /from ['"]firebase\//.test(readFileSync(file, 'utf8')));
if (unsafeFirebaseImports.length) throw new Error(`Unsafe Firebase runtime imports: ${unsafeFirebaseImports.join(', ')}`);

const authService = readFileSync('src/services/authService.js', 'utf8');
for (const method of ['sendPhoneCode', 'confirmPhoneCode', 'logout', 'getCurrentUser']) {
  if (!authService.includes(method)) throw new Error(`Missing auth service method: ${method}`);
}
const firebaseAdapter = readFileSync('src/services/auth/firebaseAuthAdapter.js', 'utf8');
for (const field of ['uid', 'phoneNumber', 'createdAt', 'deviceId', 'accountStatus']) {
  if (!firebaseAdapter.includes(field)) throw new Error(`Missing Firestore user profile field: ${field}`);
}

console.log(`Project structure OK: ${required.length} required files found; Expo Go startup is Firebase-SDK-free and SDK versions are aligned.`);
