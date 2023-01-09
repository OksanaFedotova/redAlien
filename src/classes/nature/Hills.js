export default class Hills {
    constructor(scene, x, y, img, num) {
    this.scene = scene;
      for (let i = 0; i < num; i++) {
      const hill2 = scene.add
        .image(x, y, `${img}2`)
        .setOrigin(0, 0)
        .setScale(0.5);
      const hill = scene.add
        .image(x, y - 50, `${img}`)
        .setOrigin(0, 0)
        .setScale(0.5);
        x += 960;
    }
    }
}