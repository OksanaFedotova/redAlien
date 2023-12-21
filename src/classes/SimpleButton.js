export default class SimpleButton {
  constructor(x, y, label, style, scene, callback, imageSrc, scale = 0.3, shift = 0) {
    const text = scene.add.text(0, shift, label, style).setOrigin(0.5, 0.5);
    this.image = scene.add.image(0, 0, imageSrc).setScale(scale, scale);
    this.container = scene.add.container(x, y, [this.image, text]);
    this.image.setInteractive().on('pointerdown', () => callback());
    const graphics = scene.add.graphics();

    graphics.fillStyle(0x00ff00).fillCircle();
    this.container.createGeometryMask(graphics);
  }

  get Button() {
    return this.container;
  }

  get Image() {
    return this.image;
  }
}

// start
// const button = new Button(400, 300, 'Старт', style, this, this.getRound.bind(this, '1'));
