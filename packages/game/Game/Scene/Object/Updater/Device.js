export default async (action) => {
  if (!DeviceOrientationEvent) return () => {};

  // NOTE: must be done in response to a button press...
  if (DeviceOrientationEvent.requestPermission) {
    try {
      await DeviceOrientationEvent.requestPermission();
    } catch (e) {
      return () => {};
    }
  }

  const transform = { rotation: {} };

  addEventListener("deviceorientation", ({ alpha, gamma, beta }) => {
    transform.rotation.x = Math.floor(alpha ?? 0);
    transform.rotation.y = Math.floor(gamma ?? 0);
    transform.rotation.z = Math.floor(beta ?? 0);
  });

  return (parameters) => action({ ...parameters, device: { transform } });
};
