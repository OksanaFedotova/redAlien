export default class Hills {
  constructor(scene, x, y, img, num) {
    this.scene = scene;
    for (let i = 0; i < num; i++) {
      scene.add.image(x, y, `${img}2`).setOrigin(0, 0); //.setScale(0.5);
      scene.add.image(x + 50, y, `${img}`).setOrigin(0, 0);
      x += 1920;
    }
  }
}
