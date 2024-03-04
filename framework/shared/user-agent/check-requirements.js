export default ({ engine, renderer }, requirements) => {
  let result = true;

  if (requirements.engine) {
    result &&=
      parseFloat(engine.version) >=
      parseFloat(requirements.engine[engine.name]);
  }

  if (requirements.renderer) {
    result &&=
      parseFloat(renderer.version) >=
      parseFloat(requirements.renderer[renderer.name]);
  }

  return result;
};
