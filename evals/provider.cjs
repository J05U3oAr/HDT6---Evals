const { runAgent } = require('../src/agent.cjs');

class ParachuteAgentProvider {
  id() {
    return 'parachute-agent';
  }

  async callApi(prompt) {
    const result = await runAgent(prompt);
    return {
      output: result.answer,
      metadata: { toolCalls: result.toolCalls },
    };
  }
}

module.exports = ParachuteAgentProvider;

