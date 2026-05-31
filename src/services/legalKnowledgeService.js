const mockKnowledge = [{ id: 'cnpcyf-demo-1', source: 'CNPCyF · referencia simulada', topic: 'Audiencia oral', summary: 'La audiencia se desarrolla observando oralidad, inmediación y contradicción conforme a la etapa procesal aplicable.' }];
export async function searchLegalKnowledge(query) { return mockKnowledge.filter((item) => `${item.topic} ${item.summary}`.toLowerCase().includes(query.toLowerCase())); }
// Futuro: conectar un servicio RAG y una base vectorial desde backend para
// recuperar fragmentos verificables del CNPCyF. El frontend solo consumirá resultados autorizados.
