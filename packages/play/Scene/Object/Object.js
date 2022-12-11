// TODO: utility for incrementally updating an object transform

import { Entity } from "playcanvas";
import {
  combineTransforms,
  deltaTransform,
  sanitizeTransform
} from "../../combineTransforms";

export default class Object {
  constructor({ name, transform, behaviors }) {
    this.entity = new Entity(name);
    this.transform = transform;

    this.behaviors = {};

    for (const behaviorID in behaviors) {
      this.behaviors[behaviorID] = behaviors[behaviorID].bind(this);
    }
  }

  get transform() {
    return this._transform;
  }

  set transform(transform) {
    const { position, rotation, scale } = sanitizeTransform(transform);

    this.entity.setLocalPosition(position.x, position.y, position.z);
    this.entity.setLocalEulerAngles(rotation.x, rotation.y, rotation.z);
    this.entity.setLocalScale(scale.x, scale.y, scale.z);

    this._transform = { position, rotation, scale };
  }

  update(parameters) {
    for (const behaviorID in this.behaviors) {
      this.behaviors[behaviorID]({
        ...parameters,
        self: this,
        updateWithSpeed: (transform) =>
          (this.transform = combineTransforms(
            this.transform,
            deltaTransform({
              deltaTime,
              transform
            })
          ))
      });
    }
  }
}
