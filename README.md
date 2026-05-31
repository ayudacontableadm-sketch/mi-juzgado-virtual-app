# Mi Juzgado Virtual

Base inicial de una app móvil legal-tech para practicar juicios orales con IA. Está construida con React Native y Expo y usa React Navigation. El MVP ejecutable en Expo Go usa servicios mock locales para autenticación por teléfono y persistencia, evitando incluir el SDK web de Firebase en el bundle de arranque.

## Funcionalidad incluida

- Bienvenida, login y registro por número celular con UI para código SMS.
- Servicios mock locales para enviar/verificar un código de demostración, mantener el perfil durante la sesión y simular el bloqueo de un segundo dispositivo.
- Función y pantalla básica para solicitar a soporte un cambio de dispositivo.
- Dashboard legal-tech con progreso, caso de ejemplo, nuevos juicios y estadísticas.
- Información del caso “Cobro de pagaré” y sala de audiencia navegable.
- Chat interactivo con respuestas mock del Juez IA.
- Servicios mock preparados para guardar `cases`, `hearings` y mensajes en memoria durante la sesión.
- Stub de biblioteca legal para una futura integración RAG/vector database del CNPCyF.

## Requisitos

- Node.js 20.19 o superior.
- npm.
- Expo Go para recorrer la demo visual, o un development build para integrar capacidades nativas.
- Opcional para una integración futura fuera de Expo Go: un proyecto Firebase para activar Phone Authentication y Firestore.

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

> Si tu red corporativa bloquea `registry.npmjs.org`, instala las dependencias desde una red o proxy permitido antes de ejecutar Expo.

## Autenticación local para Expo Go

El MVP no importa `firebase/app`, `firebase/auth` ni `firebase/firestore` en tiempo de ejecución. Esto mantiene el bundle inicial compatible con Expo Go en Android. Para recorrer el flujo completo:

1. Ingresa un número celular con lada y código de país, por ejemplo `+52 55 1234 5678`.
2. Presiona **Enviar código SMS**. El MVP no envía un SMS real.
3. Ingresa el código local `123456`.
4. Presiona **Verificar código** para entrar al dashboard.

También puedes usar **Entrar a demo navegable** para explorar las mismas pantallas sin crear una sesión local.

## Integración futura de Firebase

La configuración pública sigue documentada en `app.json > expo.extra`, pero el MVP no instala ni inicializa el SDK web de Firebase. Cuando se retome la integración real:

1. Crea un proyecto desde Firebase Console.
2. Registra las apps Android e iOS con el identificador `mx.mijuzgadovirtual.app`.
3. Activa **Authentication > Sign-in method > Phone**.
4. Crea Firestore y publica las reglas iniciales desde `firestore.rules`.
5. Reemplaza los valores `YOUR_*` en `app.json > expo.extra` con la configuración pública de tu app Firebase.
6. Implementa un adaptador Firebase separado y cárgalo únicamente en un development build compatible; no lo importes desde el bundle de arranque de Expo Go.

Los valores de configuración pública de Firebase pueden vivir en la app; no agregues secretos administrativos, credenciales de servicio ni API keys privadas de proveedores de IA al frontend. El bloqueo local de dispositivo del MVP solo sirve para demostración. Antes de producción debes hacer esta validación autoritativa desde backend o Cloud Functions y reforzarla con Firebase App Check y tokens de sesión revocables. Un cliente móvil por sí solo no puede garantizar seguridad contra una app manipulada.

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
  firebase/       Configuración pública reservada para una integración futura
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
3. Reemplazar la persistencia mock de `hearingService.js` por un adaptador remoto compatible con el build elegido.
4. Construir un pipeline RAG verificable para el CNPCyF con citas de fuente y una base vectorial operada desde backend.
