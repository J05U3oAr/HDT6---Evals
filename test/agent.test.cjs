const test = require('node:test');
const assert = require('node:assert/strict');
const { resetCalendar } = require('../src/calendar.cjs');
const { runAgent } = require('../src/agent.cjs');

test.beforeEach(() => resetCalendar());

test('agenda una cita válida mediante la herramienta de calendario', async () => {
  const result = await runAgent('Quiero agendar una cita el 2026-10-05 a las 10:00 para asesoría.');
  assert.match(result.answer, /Cita agendada correctamente/);
  assert.equal(result.toolCalls[0].name, 'calendar.createAppointment');
  assert.equal(result.toolCalls[0].output.ok, true);
});

test('responde una FAQ a través de la base de conocimiento', async () => {
  const result = await runAgent('¿Cuál es su horario de atención?');
  assert.match(result.answer, /lunes a viernes, de 08:00 a 17:00/);
  assert.equal(result.toolCalls[0].name, 'knowledge.searchFAQ');
});
