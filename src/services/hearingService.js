import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
export async function saveCase(caseData, uid) { await setDoc(doc(db, 'cases', caseData.id), { ...caseData, uid, updatedAt: serverTimestamp() }, { merge: true }); }
export async function startHearing(caseId, uid) { return addDoc(collection(db, 'hearings'), { caseId, uid, status: 'in_progress', startedAt: serverTimestamp() }); }
export async function saveMessage(hearingId, message) { return addDoc(collection(db, 'hearings', hearingId, 'messages'), { ...message, createdAt: serverTimestamp() }); }
