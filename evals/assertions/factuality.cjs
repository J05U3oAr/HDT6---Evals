module.exports = (output, context) => {
  const rawFacts = context.vars.requiredFacts || [];
  const requiredFacts = Array.isArray(rawFacts)
    ? rawFacts
    : String(rawFacts).split('|').map((fact) => fact.trim()).filter(Boolean);
  const missingFacts = requiredFacts.filter(
    (fact) => !output.toLocaleLowerCase('es-GT').includes(fact.toLocaleLowerCase('es-GT')),
  );

  return {
    pass: missingFacts.length === 0,
    score: missingFacts.length === 0 ? 1 : 0,
    reason: missingFacts.length === 0
      ? 'La respuesta contiene todos los hechos canónicos esperados.'
      : `Faltan hechos: ${missingFacts.join(', ')}`,
  };
};

