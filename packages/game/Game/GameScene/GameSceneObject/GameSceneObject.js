import { Entity } from "playcanvas";

export class GameSceneObject {
  constructor({ name, transform, updaters }) {
    this.entity = new Entity(name);
    this.transform = transform;

    this.updaters = {};

    for (const updaterID in updaters) {
      this.updaters[updaterID] = updaters[updaterID].bind(this);
    }
  }

  get transform() {
    return this._transform;
  }

  set transform({
    position = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0 },
    scale = { x: 1, y: 1, z: 1 }
  }) {
    this.entity.setLocalPosition(position.x, position.y, position.z);
    this.entity.setLocalEulerAngles(rotation.x, rotation.y, rotation.z);
    this.entity.setLocalScale(scale.x, scale.y, scale.z);

    this._transform = { position, rotation, scale };
  }

  update(parameters) {
    for (const updaterID in this.updaters) {
      this.updaters[updaterID]({ ...parameters, self: this });
    }
  }
}
