import { Color } from "playcanvas";

export * from "./GameSceneObject";

export class GameScene {
  constructor({ cameras, lights, actors, background }) {
    this.background = new Color(...background);

    for (const camera of cameras) {
      camera.entity.camera.clearColor = this.background;
    }

    this.cameras = cameras;
    this.lights = lights;
    this.actors = actors;
  }

  // plenty of room to optimize, here
  update(parameters) {
    const updateObject = { scene: this, ...parameters };

    for (const cameraName in this.cameras)
      this.cameras[cameraName].update(updateObject);

    for (const lightName in this.lights)
      this.lights[lightName].update(updateObject);

    for (const actorName in this.actors)
      this.actors[actorName].update(updateObject);
  }
}
