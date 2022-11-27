import { Application, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO } from "playcanvas";

export * from "./GameScene";
export * from "./GameStage";

export * from "./bootstrapPlaycanvas";
export * from "./combineTransforms";

export class Game {
  constructor({ stage, currentScene = "main", scenes }) {
    this.stage = stage;
    this.app = new Application(stage.renderElement);

    this.app.autoRender = false;
    this.app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
    this.app.setCanvasResolution(RESOLUTION_AUTO);

    this.scenes = scenes;
    this._currentScene = currentScene;

    this.app.render();
    this.app.on("update", this.render);

    this.app.start();
  }

  get currentScene() {
    return this.scenes[this._currentScene];
  }

  set currentScene(sceneID) {
    // unload previous scene
    const previousScene = this.scenes[this._currentScene];

    for (const cameraName in previousScene.cameras)
      this.app.root.removeChild(previousScene.cameras[cameraName].entity);

    for (const lightName in previousScene.lights)
      this.app.root.removeChild(previousScene.lights[lightName].entity);

    for (const actorName in previousScene.actors)
      this.app.root.removeChild(previousScene.actors[actorName].entity);

    this._currentScene = sceneID;

    // load new scene
    const currentScene = this.scenes[this._currentScene];

    for (const cameraName in currentScene.cameras)
      this.app.root.addChild(currentScene.cameras[cameraName].entity);

    for (const lightName in currentScene.lights)
      this.app.root.addChild(currentScene.lights[lightName].entity);

    for (const actorName in currentScene.actors)
      this.app.root.addChild(currentScene.actors[actorName].entity);
  }

  play() {
    this.app.autoRender = true;
  }

  pause() {
    this.app.autoRender = false;
  }

  render(deltaTime = 0) {
    this.app.resizeCanvas(); // ?
    this.currentScene.update({ deltaTime, game: this });
  }
}
