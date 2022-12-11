import Object from "./Object";

export class Camera extends Object {
  constructor(parameters) {
    super(parameters);

    this.entity.addComponent("camera");
  }
}
