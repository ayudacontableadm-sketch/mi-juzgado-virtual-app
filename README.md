# Mi Juzgado Virtual

App móvil legal-tech para practicar juicios orales con IA. Está construida con React Native, Expo SDK 54 y React Navigation. La app conserva un modo mock compatible con Expo Go y agrega un adaptador Firebase REST separado para autenticación telefónica real y perfiles de usuario en Firestore.

## Funcionalidad incluida

- Bienvenida, login y registro por número celular con UI para código SMS.
- API pública de autenticación en `src/services/authService.js`: `sendPhoneCode(phone)`, `confirmPhoneCode(code)`, `logout()` y `getCurrentUser()`.
- Modo mock local explícito para Expo Go con el código `123456`.
- Adaptador Firebase REST separado para confirmar el SMS real y crear el perfil `users/{uid}` en Firestore.
- Perfil Firestore con `uid`, `phoneNumber`, `createdAt`, `deviceId` y `accountStatus`.
- Bloqueo por dispositivo: el primer login guarda el `deviceId`; un login posterior desde otro dispositivo se rechaza y muestra el mensaje de soporte.
- Función y pantalla básica para solicitar a soporte un cambio de dispositivo.
- Dashboard legal-tech, caso de ejemplo, sala de audiencia navegable y chat mock con el Juez IA.

## Requisitos

- Node.js 20.19 o superior.
- npm.
- Expo Go para recorrer la app con autenticación SMS simulada.
- Un proyecto Firebase y un development build para conectar un proveedor nativo de verificación telefónica y enviar SMS reales.

## Instalación y ejecución

```bash
npm install
npm run check
npx expo install --check
npm run start -- --clear
```

Después escanea el QR desde Expo Go o abre el proyecto en un simulador. También puedes intentar:

```bash
npm run android
npm run ios
npm run web
```

## Configuración pública de Firebase

Firebase usa configuración pública, no credenciales administrativas. `src/config/firebase.js` carga el `firebaseConfig` actual desde `app.json > expo.extra` y permite sobrescribirlo mediante variables de entorno. Puedes reemplazar los placeholders seguros o definir estas variables antes de iniciar Expo:

```bash
export EXPO_PUBLIC_FIREBASE_API_KEY="..."
export EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
export EXPO_PUBLIC_FIREBASE_PROJECT_ID="tu-proyecto"
export EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
export EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
export EXPO_PUBLIC_FIREBASE_APP_ID="..."
```

Nunca agregues service-account JSON, secretos administrativos ni API keys privadas de proveedores de IA al frontend.

## Autenticación mock para Expo Go

Firebase Phone Auth exige una prueba anti-abuso generada por reCAPTCHA o por capacidades nativas de la app. Expo Go no puede incorporar la configuración nativa específica del proyecto. Por eso `app.json` mantiene `firebaseAuthMode: "mock"` por defecto y la app abre correctamente en Expo Go sin importar módulos nativos adicionales.

Para recorrer el flujo completo en Expo Go:

1. Ingresa un celular con lada y código de país, por ejemplo `+52 55 1234 5678`.
2. Presiona **Enviar código SMS**. No se envía un SMS real.
3. Ingresa el código local `123456`.
4. Presiona **Verificar código**.

También puedes usar **Entrar a demo navegable** para explorar pantallas sin crear una sesión local.

## Activar Firebase real en un development build

1. Crea un proyecto desde Firebase Console.
2. Registra Android e iOS con el identificador `mx.mijuzgadovirtual.app`.
3. Activa **Authentication > Sign-in method > Phone** y configura los requisitos de plataforma de Firebase para verificación telefónica.
4. Crea Firestore y publica las reglas iniciales desde `firestore.rules`.
5. Define la configuración pública indicada arriba.
6. Define `EXPO_PUBLIC_AUTH_MODE=firebase` o cambia `firebaseAuthMode` a `"firebase"` en `app.json`.
7. En el arranque del development build, registra un proveedor nativo mediante `setPhoneVerificationProvider(provider)` de `authService`. El proveedor recibe el teléfono y debe resolver una prueba aceptada por el endpoint `accounts:sendVerificationCode`, por ejemplo `{ recaptchaToken }`, `{ safetyNetToken }` o los campos iOS correspondientes.

El adaptador real confirma el código contra Firebase Authentication, autentica las solicitudes REST de Firestore y crea `users/{uid}` durante el primer login. Si ese perfil ya tiene otro `deviceId`, cierra la sesión local y bloquea el acceso.

> El bloqueo desde el cliente cubre el flujo normal de la app, pero una app manipulada podría omitirlo. Antes de producción, mueve la validación autoritativa a backend o Cloud Functions, limita las reglas de actualización del perfil y refuerza el sistema con Firebase App Check y sesiones revocables.

## Colecciones Firestore

```text
users/{uid}
cases/{caseId}
hearings/{hearingId}
hearings/{hearingId}/messages/{messageId}
deviceChangeRequests/{requestId}
```

## Estructura relevante

```text
src/
  config/         Configuración pública de Firebase y selección de modo
  services/auth/  Adaptadores mock y Firebase REST separados
  services/       Fachada auth, dispositivo, mocks de audiencia e IA
  screens/        Pantallas de la app
```

## Comprobación rápida

```bash
npm run check
```
