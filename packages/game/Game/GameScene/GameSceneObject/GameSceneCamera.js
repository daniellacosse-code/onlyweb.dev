import { GameSceneObject } from "./GameSceneObject";

export class GameSceneCamera extends GameSceneObject {
  constructor(parameters) {
    super(parameters);

    this.entity.addComponent("camera");
  }
}
