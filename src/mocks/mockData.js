export const exampleCase = {
  id: 'cobro-pagare-demo',
  title: 'Caso: Cobro de pagaré',
  subject: 'Civil',
  trialType: 'Ejecutivo mercantil',
  claim: 'Cobro de pagaré',
  amount: '$250,000.00 MXN',
  proceduralStage: 'Audiencia oral',
  progress: 70,
  lastSession: 'Hoy',
  description: 'Se requiere que demuestres el incumplimiento de pago de un pagaré suscrito por la parte demandada, y argumentes tu pretensión en juicio oral.',
  roles: [
    ['Juez', 'IA'], ['Demandado', 'IA'], ['Ministerio Público', 'IA (si aplica)'], ['Escribiente', 'IA'],
  ],
};
export const initialMessages = [
  { id: '1', role: 'Juez', time: '00:15', text: 'Se abre la audiencia. Por favor, parte actora, exponga brevemente su pretensión.' },
  { id: '2', role: 'Tú (parte actora)', time: '00:45', text: 'Con su permiso, su señoría. Vengo a demandar el pago de la cantidad derivada del pagaré base de la acción...', own: true },
  { id: '3', role: 'Demandado', time: '01:20', text: 'Me opongo a la demanda. El pagaré ya fue pagado en su totalidad.' },
  { id: '4', role: 'Juez', time: '01:35', text: 'Parte actora, ¿desea replicar?' },
];
