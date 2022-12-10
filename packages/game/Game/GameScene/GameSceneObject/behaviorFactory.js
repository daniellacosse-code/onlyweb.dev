export const keyboardBehaviorFactory = (behavior) => {
  const input = {};

  addEventListener("keydown", ({ key }) => (input[key] = true));
  addEventListener("keyup", ({ key }) => (input[key] = false));

  return (parameters) => behavior({ ...parameters, input });
};

export const deviceOrientationBehaviorFactory = () => {};
