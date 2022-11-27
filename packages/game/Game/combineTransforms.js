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
