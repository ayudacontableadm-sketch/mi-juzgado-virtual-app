let verifier;
export function registerPhoneAuthVerifier(nativeVerifier) { verifier = nativeVerifier; }
export function getPhoneAuthVerifier() { return verifier; }
// El contenedor nativo del development build debe registrar aquí el verifier
// compatible con Firebase Phone Authentication antes de solicitar un SMS.
