module.exports = (_output, context) => {
  const calls = context.providerResponse?.metadata?.toolCalls
    || context.metadata?.toolCalls
    || [];
  const expectedTool = context.vars.expectedTool;
  const expectedArgs = context.vars.expectedToolArgs || {};
  const call = calls.find((candidate) => candidate.name === expectedTool);

  if (!call) {
    return { pass: false, score: 0, reason: `No se llamó a ${expectedTool}.` };
  }
  if (call.is_error) {
    return { pass: false, score: 0, reason: `${expectedTool} reportó un error.` };
  }

  const wrongArgument = Object.entries(expectedArgs).find(
    ([key, value]) => call.input?.[key] !== value,
  );
  if (wrongArgument) {
    return {
      pass: false,
      score: 0,
      reason: `Argumento incorrecto: ${wrongArgument[0]}.`,
    };
  }
  return { pass: true, score: 1, reason: `${expectedTool} fue llamada correctamente.` };
};

