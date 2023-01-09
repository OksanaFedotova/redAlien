import {getRandomArbitrary} from "../../functions/auxiliary";
export default class Clouds {
  constructor(scene, img, x, y) {
    this.scene = scene;
    for (let i = 0; i < 100; i++) {
      const scale = getRandomArbitrary(0.8, 1.2)
        scene.add
          .image(x, y, img)
          .setScale(scale);
        const sign = Math.round(getRandomArbitrary(0, 1));
        sign
          ? (y += getRandomArbitrary(50, 70))
          : (y -= getRandomArbitrary(50, 70));
        y > 600 ? (y = 600) : y;
        y < 0 ? (y = 0) : y;
        x += 600;
      }
  }
}