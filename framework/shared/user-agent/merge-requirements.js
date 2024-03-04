export default (...requirements) => {
  const result = {};

  for (const requirement of requirements) {
    if (!requirement) continue;

    if (requirement.engine) {
      result.engine ??= {};

      for (const engineName in requirement.engine) {
        result.engine[engineName] = Math.max(
          parseFloat(result.engine[engineName] ?? 0),
          parseFloat(requirement.engine[engineName])
        );
      }
    }

    if (requirement.renderer) {
      result.renderer ??= {};

      for (const rendererName in requirement.renderer) {
        result.renderer[rendererName] = Math.max(
          parseFloat(result.renderer[rendererName] ?? 0),
          parseFloat(requirement.renderer[rendererName])
        );
      }
    }
  }

  return result;
};
