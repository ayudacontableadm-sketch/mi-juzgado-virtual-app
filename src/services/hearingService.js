const cases = new Map();
const hearings = new Map();
const messages = new Map();

export async function saveCase(caseData, uid) {
  const storedCase = { ...caseData, uid, updatedAt: new Date().toISOString() };
  cases.set(caseData.id, storedCase);
  return storedCase;
}

export async function startHearing(caseId, uid) {
  const hearing = { id: `demo-hearing-${Date.now()}`, caseId, uid, status: 'in_progress', startedAt: new Date().toISOString() };
  hearings.set(hearing.id, hearing);
  return hearing;
}

export async function saveMessage(hearingId, message) {
  const storedMessage = { ...message, id: message.id ?? `demo-message-${Date.now()}`, createdAt: new Date().toISOString() };
  const hearingMessages = messages.get(hearingId) ?? [];
  hearingMessages.push(storedMessage);
  messages.set(hearingId, hearingMessages);
  return storedMessage;
}

// MVP Expo Go: persistencia local en memoria para evitar cargar Firestore al
// arranque. Sustituir por un adaptador remoto en un development build.
