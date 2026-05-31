const mockReplies = [
  'Se tiene por formulada su manifestación. Precise, por favor, cuál es la prueba principal que sustenta su pretensión.',
  'La parte demandada podrá pronunciarse. Posteriormente resolveré sobre la admisión de las pruebas ofrecidas.',
  'Tome nota la escribiente. Parte actora, puede continuar con su exposición.',
];
let replyIndex = 0;
export async function getMockAiReply() { await new Promise((resolve) => setTimeout(resolve, 550)); const text = mockReplies[replyIndex % mockReplies.length]; replyIndex += 1; return { id: `ai-${Date.now()}`, role: 'Juez', time: 'Ahora', text }; }
// La integración real con IA debe vivir en un backend seguro o Firebase Cloud
// Functions. Nunca colocar llaves privadas ni secretos de proveedores en el frontend.
