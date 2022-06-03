import {getRandomArbitrary} from "../../functions/auxiliary";
export default class Clouds {
  constructor(scene, img, x, y, scale = 1) {
    this.scene = scene;
    for (let i = 0; i < 100; i++) {
        const cloud = scene.add
          .image(x, y, img)
          .setOrigin(0, 0)
          .setScale(scale);
        const sign = Math.round(getRandomArbitrary(0, 1));
        sign
          ? (y += getRandomArbitrary(50, 150))
          : (y -= getRandomArbitrary(50, 150));
        y > 700 ? (y = 700) : y;
        y < 100 ? (y = 100) : y;
        x += getRandomArbitrary(100, 1000);
      }
  }
}