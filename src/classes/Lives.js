import { heartsIndex } from '../utils/hearts';
export default class Lives {
  constructor(scene, x = 760, y = 50) {
    this.scene = scene;
    this.heartsImages = Object.values(heartsIndex.hearts).map((heart) => {
      const heartImage = scene.add.sprite(x, y, heart).setScrollFactor(0, 0);
      x -= 38;
      return heartImage;
    });

    const anims = scene.anims;
    anims.create({
      key: 'disappear',
      frames: anims.generateFrameNumbers('heart', { start: 0, end: 1 }),
      frameRate: 15,
      repeat: 4,
    });
  }
  lose(i) {
    console.log(this.heartsImages[i]);
    this.heartsImages[i].anims.play('disappear', false);
    heartsIndex.hearts[i] = 'blackHeart';
  }
}
