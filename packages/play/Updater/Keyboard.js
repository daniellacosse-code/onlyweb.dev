export default (action) => {
  const keyboard = {};

  addEventListener("keydown", ({ key }) => (keyboard[key] = true));
  addEventListener("keyup", ({ key }) => (keyboard[key] = false));

  return (parameters) => action({ ...parameters, keyboard });
};
