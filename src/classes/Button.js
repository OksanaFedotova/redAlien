// import Phaser from 'phaser';

export default class Button {
  constructor(x, y, inner, scene, callback, name, stars) {
    let image;
    this.stars = [];
    if (stars) {
      for (let i = 0; i < stars.quantity; i++) {
        this.stars.push(scene.add.image(-25 + i * 25, -55, stars.name).setScale(0.5, 0.5));
      }
    }
    if (inner.img) {
      this.inner = scene.add.image(0, -3, inner.name).setScale(0.3, 0.3);
    } else {
      this.inner = scene.add.text(0, 0, inner.name, inner.style).setOrigin(0.5, 0.5);
    }
    if (name) image = scene.add.image(0, 0, name).setScale(0.3, 0.3);
    const container = this.stars ? [image, this.inner, ...this.stars] : [image, this.inner];
    scene.add.container(x, y, container);
    image.setInteractive().on('pointerdown', () => callback());
  }
}
