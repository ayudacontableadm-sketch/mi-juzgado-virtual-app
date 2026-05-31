import { existsSync, readFileSync } from 'node:fs';
const required = [
  'App.js', 'app.json', 'src/theme/theme.js', 'src/navigation/AppNavigator.js',
  'src/services/aiService.js', 'src/services/legalKnowledgeService.js', 'src/services/authService.js',
  'src/firebase/config.js', 'src/components/AppButton.js', 'src/components/AppCard.js',
  'src/components/ProgressBar.js', 'src/components/CaseCard.js', 'src/components/ChatBubble.js',
  'src/components/BottomTabs.js', 'src/components/Stepper.js', 'src/screens/WelcomeScreen.js',
  'src/screens/LoginScreen.js', 'src/screens/RegisterScreen.js', 'src/screens/DashboardScreen.js',
  'src/screens/CaseInfoScreen.js', 'src/screens/HearingRoomScreen.js', 'src/screens/ProfileScreen.js'
];
const missing = required.filter((file) => !existsSync(file));
if (missing.length) throw new Error(`Missing files: ${missing.join(', ')}`);
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
for (const dependency of ['expo', 'firebase', '@react-navigation/native', 'expo-application', 'expo-device']) {
  if (!pkg.dependencies[dependency]) throw new Error(`Missing dependency: ${dependency}`);
}
console.log(`Project structure OK: ${required.length} required files found.`);
