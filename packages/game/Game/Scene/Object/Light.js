import Object from "./Object";

export default class Light extends Object {
  constructor(parameters) {
    super(parameters);

    this.entity.addComponent("light");
  }
}
