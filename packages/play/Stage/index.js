import { Application, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO } from "playcanvas";

export default class Stage {
  constructor({ stageElement, curtainElement }) {
    this.stageElement = stageElement;
    this.curtainElement = curtainElement;

    this.isRendering = false;

    this._app = new Application(this.stageElement);
    this._app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
    this._app.setCanvasResolution(RESOLUTION_AUTO);
    this._app.autoRender = false;
  }

  add(objectMap) {
    for (const objectID in objectMap) {
      this._app.root.addChild(objectMap[objectID].entity);
    }
  }

  remove(objectMap) {
    for (const objectID in objectMap) {
      this_app.root.removeChild(objectMap[objectID].entity);
    }
  }

  render() {
    if (!this.isRendering) {
      this.isRendering = true;

      this._app.start();
    }

    this._app.resizeCanvas();
    this._app.renderNextFrame = this.isRendering;
  }
}
