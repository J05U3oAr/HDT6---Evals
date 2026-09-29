const { runAgent } = require('../src/agent.cjs');
const { resetCalendar } = require('../src/calendar.cjs');

class ParachuteAgentProvider {
  id() {
    return 'parachute-agent';
  }

  async callApi(prompt) {
    // Promptfoo puede invocar el proveedor más de una vez al evaluar aserciones.
    // Cada caso debe empezar con un calendario limpio para ser independiente.
    resetCalendar();
    const result = await runAgent(prompt);
    return {
      output: result.answer,
      metadata: { toolCalls: result.toolCalls },
    };
  }
}

module.exports = ParachuteAgentProvider;

