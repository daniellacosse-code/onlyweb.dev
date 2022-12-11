const DEFAULT_POSTITION = { x: 0, y: 0, z: 0 };
const DEFAULT_ROTATION = { x: 0, y: 0, z: 0 };
const DEFAULT_SCALE = { x: 1, y: 1, z: 1 };

export function sanitizeTransform({ position, rotation, scale }) {
  position ??= DEFAULT_POSTITION;
  rotation ??= DEFAULT_ROTATION;
  scale ??= DEFAULT_SCALE;

  return {
    position: { ...DEFAULT_POSTITION, ...position },
    rotation: { ...DEFAULT_ROTATION, ...rotation },
    scale: { ...DEFAULT_SCALE, ...scale }
  };
}

export function combineTransforms(...transforms) {
  return transforms.reduce((result, transform) => {
    if (!transform) return result;

    transform = sanitizeTransform(transform);

    result.position.x += position.x;
    result.position.y += position.y;
    result.position.z += position.z;
    result.rotation.x += rotation.x;
    result.rotation.y += rotation.y;
    result.rotation.z += rotation.z;
    result.scale.x *= scale.x;
    result.scale.y *= scale.y;
    result.scale.z *= scale.z;

    return result;
  }, {});
}

export function deltaTransform({ deltaTime, transform }) {
  const { position, rotation /* scale TODO */ } = sanitizeTransform(transform);

  return {
    position: {
      x: position.x * deltaTime,
      y: position.y * deltaTime,
      z: position.z * deltaTime
    },
    rotation: {
      x: rotation.x * deltaTime,
      y: rotation.y * deltaTime,
      z: rotation.z * deltaTime
    }
    // scale: {
    //   x: scale.x * deltaTime,
    //   y: scale.y * deltaTime,
    //   z: scale.z * deltaTime
    // }
  };
}
