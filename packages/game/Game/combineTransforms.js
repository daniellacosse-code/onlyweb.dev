export function combineTransforms(...transforms) {
  return transforms.reduce((result, { position, rotation, scale }) => {
    if (position) {
      result.position ??= { x: 0, y: 0, z: 0 };

      result.position.x += position.x;
      result.position.y += position.y;
      result.position.z += position.z;
    }

    if (rotation) {
      result.rotation ??= { x: 0, y: 0, z: 0 };

      result.rotation.x += rotation.x;
      result.rotation.y += rotation.y;
      result.rotation.z += rotation.z;
    }

    if (scale) {
      result.scale ??= { x: 1, y: 1, z: 1 };

      result.scale.x *= scale.x;
      result.scale.y *= scale.y;
      result.scale.z *= scale.z;
    }

    return result;
  }, {});
}

export function deltaTransform({
  deltaTime,
  transform: {
    position = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0 }
    // scale = { x: 1, y: 1, z: 1 } // TODO
  }
}) {
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
