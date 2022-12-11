export * as Scene from "./Scene";
export * as Stage from "./Stage";

export * from "./combineTransforms";
export * from "./createColor";

export default class Game {
  constructor({ stage, currentScene = "main", scenes }) {
    this.stage = stage;
    this.scenes = scenes;
    this.currentScene = currentScene;
  }

  get currentScene() {
    return this.scenes[this._currentScene];
  }

  set currentScene(sceneID) {
    // unload previous scene
    const previousScene = this.scenes[this._currentScene];

    if (previousScene) {
      this.stage.remove(previousScene.cameras);
      this.stage.remove(previousScene.lights);
      this.stage.remove(previousScene.actors);
    }

    this._currentScene = sceneID;

    // load new scene
    const currentScene = this.scenes[this._currentScene];

    this.stage.add(currentScene.cameras);
    this.stage.add(currentScene.lights);
    this.stage.add(currentScene.actors);
  }

  play() {
    // don't start multiple game loops
    if (this._loopID) return;

    this._loopID = this._loop();
  }

  pause() {
    cancelAnimationFrame(this._loopID);

    this._loopID = null;

    // TODO: not great, stage should pause itself
    this.stage.isRendering = false;
  }

  update({ deltaTime = 0 }) {
    this.currentScene.update({ deltaTime, game: this });
    this.stage.render();
  }

  _loop() {
    const loopStart = performance.now();
    this._loopID = requestAnimationFrame(() => {
      this.update({ deltaTime: (performance.now() - loopStart) / 1000 });
      this._loop();
    });
  }
}
