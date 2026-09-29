const { createAppointment } = require('./calendar.cjs');
const { searchFaq } = require('./knowledge-base.cjs');

function buildToolCall(name, input, output, is_error = false) {
  return { name, input, output, is_error };
}

function extractAppointmentDetails(message) {
  const date = message.match(/\b(20\d{2}-\d{2}-\d{2})\b/)?.[1];
  const time = message.match(/\b([01]\d|2[0-3]):[0-5]\d\b/)?.[0];
  const reason = message.match(/(?:por|para|motivo)\s+(.+?)(?:[.!?]|$)/i)?.[1]?.trim() || 'Consulta general';
  return { date, time, reason };
}

async function runAgent(message) {
  const normalized = message.toLocaleLowerCase('es-GT');
  const toolCalls = [];
  const faq = searchFaq(message);

  // Las FAQs tienen prioridad para que "cancelar una cita" no se interprete
  // como una solicitud de crear una nueva cita.
  if (faq) {
    toolCalls.push(buildToolCall('knowledge.searchFAQ', { question: message }, faq, false));
    return { answer: faq.answer, toolCalls };
  }

  if (/(agendar|agenda|reservar|cita)/.test(normalized)) {
    const details = extractAppointmentDetails(message);
    if (!details.date || !details.time) {
      return {
        answer: 'Para agendar una cita necesito la fecha (AAAA-MM-DD) y la hora (HH:MM).',
        toolCalls,
      };
    }

    const result = createAppointment(details);
    toolCalls.push(buildToolCall('calendar.createAppointment', details, result, !result.ok));
    if (!result.ok) {
      return { answer: `No pude agendar la cita: ${result.error}`, toolCalls };
    }

    const { appointment } = result;
    return {
      answer: `Cita agendada correctamente para el ${appointment.date} a las ${appointment.time}. Motivo: ${appointment.reason}. Confirmación: ${appointment.id}.`,
      toolCalls,
    };
  }

  toolCalls.push(buildToolCall('knowledge.searchFAQ', { question: message }, faq, !faq));
  return {
    answer: 'No tengo información confirmada sobre esa consulta. Puedes escribir a soporte@parachute.example.',
    toolCalls,
  };
}

module.exports = { extractAppointmentDetails, runAgent };

