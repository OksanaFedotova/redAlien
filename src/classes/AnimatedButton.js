/* eslint-disable no-param-reassign */
import Phaser from 'phaser';

export default class AnimatedButton {
  constructor({ x, y }, imageSrc, { label, style }, scene, { callback1, callback2, flag }) {
    const text = scene.add.text(0, 30, label, style).setOrigin(0.5, 0.5);
    const image = scene.add.sprite(0, 0, imageSrc).setScale(0.2, 0.2);
    scene.add
      .container(x, y, [image, text])
      .setInteractive(new Phaser.Geom.Rectangle(-50, -30, 100, 100), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => {
        if (!flag) {
          image.anims.play('soundOn', false);
          text.setText('включить звук');
          flag = callback1();
        } else {
          image.anims.play('soundOff', false);
          text.setText('выключить звук');
          flag = callback2();
        }
      });
    scene.anims.create({
      key: 'soundOff',
      frames: scene.anims.generateFrameNumbers(imageSrc, { start: 1, end: 0 }),
      frameRate: 10,
      repeat: 0,
    });
    scene.anims.create({
      key: 'soundOn',
      frames: scene.anims.generateFrameNumbers(imageSrc, { start: 0, end: 1 }),
      frameRate: 10,
      repeat: 0,
    });
  }
}
