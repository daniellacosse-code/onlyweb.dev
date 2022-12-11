import Object from "./Object";

export class Actor extends Object {
  constructor({ model, ...parameters }) {
    super(parameters);

    this.entity.addComponent("model", { type: model });
  }
}
