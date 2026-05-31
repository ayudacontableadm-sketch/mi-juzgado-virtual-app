# Mi Juzgado Virtual

Base inicial de una app móvil legal-tech para practicar juicios orales con IA. Está construida con React Native y Expo, usa React Navigation y deja preparados Firebase Authentication por teléfono y Firestore. La primera versión incluye una ruta demo para recorrer la interfaz mientras se configura Firebase.

## Funcionalidad incluida

- Bienvenida, login y registro por número celular con UI para código SMS.
- Servicios Firebase para enviar/verificar el código, persistir el perfil y bloquear un segundo dispositivo.
- Función y pantalla básica para solicitar a soporte un cambio de dispositivo.
- Dashboard legal-tech con progreso, caso de ejemplo, nuevos juicios y estadísticas.
- Información del caso “Cobro de pagaré” y sala de audiencia navegable.
- Chat interactivo con respuestas mock del Juez IA.
- Servicios preparados para guardar `cases`, `hearings` y subcolecciones `messages` en Firestore.
- Stub de biblioteca legal para una futura integración RAG/vector database del CNPCyF.

## Requisitos

- Node.js 20 o superior.
- npm.
- Expo Go para recorrer la demo visual, o un development build para integrar capacidades nativas.
- Un proyecto Firebase para activar Phone Authentication y Firestore.

## Instalación y ejecución

```bash
npm install
npm run start
```

Después escanea el QR desde Expo Go o abre el proyecto en un simulador. También puedes intentar:

```bash
npm run android
npm run ios
npm run web
```

> Si tu red corporativa bloquea `registry.npmjs.org`, instala las dependencias desde una red o proxy permitido antes de ejecutar Expo.

## Configuración de Firebase

1. Crea un proyecto desde Firebase Console.
2. Registra las apps Android e iOS con el identificador `mx.mijuzgadovirtual.app`.
3. Activa **Authentication > Sign-in method > Phone**.
4. Crea Firestore y publica las reglas iniciales desde `firestore.rules`.
5. Reemplaza los valores `YOUR_*` en `app.json > expo.extra` con la configuración pública de tu app Firebase.
6. Configura las credenciales nativas requeridas por Firebase Phone Authentication para Android/iOS y genera un development build de Expo. Registra el verificador nativo mediante `registerPhoneAuthVerifier` de `src/services/phoneAuthBridge.js`. Las pantallas llaman a `sendSmsCode` y `verifySmsCode` de `src/services/authService.js`, por lo que el flujo queda conectado cuando el development build aporta ese verificador.

Los valores de configuración pública de Firebase pueden vivir en la app; no agregues secretos administrativos, credenciales de servicio ni API keys privadas de proveedores de IA al frontend.

### Flujo demo y flujo productivo

La pantalla de login incluye **Entrar a demo navegable** para explorar el diseño sin Firebase configurado. Esa ruta no crea una sesión. En producción debes eliminarla y conectar los botones de envío/verificación de SMS con `sendSmsCode` y `verifySmsCode` usando el verificador nativo correspondiente.

El control actual registra `uid`, `phoneNumber`, `registeredAt`, `deviceId`, `deviceName`, `accountStatus` y `updatedAt` en `users/{uid}`. Si el mismo usuario llega desde otro `deviceId`, el cliente cierra la sesión y presenta el bloqueo. Antes de producción debes hacer esta validación autoritativa desde backend o Cloud Functions y reforzarla con Firebase App Check y tokens de sesión revocables. Un cliente móvil por sí solo no puede garantizar seguridad contra una app manipulada.

## Colecciones Firestore propuestas

```text
users/{uid}
cases/{caseId}
hearings/{hearingId}
hearings/{hearingId}/messages/{messageId}
deviceChangeRequests/{requestId}
```

## Estructura

```text
src/
  assets/
  components/     Componentes visuales reutilizables
  firebase/       Inicialización de Firebase
  mocks/          Caso y mensajes de ejemplo
  navigation/     Stack principal
  screens/        Pantallas de la app
  services/       Auth, dispositivo, Firestore, IA mock y conocimiento legal
  theme/          Colores, tipografía, espaciado y estilos compartidos
```

## Comprobación rápida

```bash
npm run check
```

## Próximos pasos recomendados

1. Crear Cloud Functions para validar el dispositivo, emitir/revocar sesiones y procesar solicitudes de cambio.
2. Conectar el chat a una Cloud Function segura que invoque el proveedor de IA sin exponer secretos.
3. Guardar el avance de cada audiencia y mensajes mediante `hearingService.js`.
4. Construir un pipeline RAG verificable para el CNPCyF con citas de fuente y una base vectorial operada desde backend.
