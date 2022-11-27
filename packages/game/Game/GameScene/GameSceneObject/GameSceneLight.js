import { GameSceneObject } from "./GameSceneObject";

export class GameSceneLight extends GameSceneObject {
  constructor(parameters) {
    super(parameters);

    this.entity.addComponent("light");
  }
}
