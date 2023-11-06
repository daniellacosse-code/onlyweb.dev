import { GameSceneObject } from "./GameSceneObject";

export class GameSceneActor extends GameSceneObject {
  constructor({ model, ...parameters }) {
    super(parameters);

    this.entity.addComponent("model", { type: model });
  }
}
