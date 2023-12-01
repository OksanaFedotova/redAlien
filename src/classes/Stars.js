import starsData from './starsData';
export class Stars {
  constructor(scene, x, y, img) {
    this.scene = scene;
    this.flag = true;
    this.star = scene.physics.add.sprite(x, y, img).setScale(0.4, 0.4).setOrigin(0, 0);
    scene.physics.world.enable(this.star);
    this.star.body.setAllowGravity(false);
    this.take = this.take.bind(this);
    scene.anims.create({
      key: 'star',
      frames: scene.anims.generateFrameNumbers('star', { start: 0, end: 17 }),
      repeat: -1,
    });
  }
  create() {
    this.star.anims.play('star', true);
  }
  take(player, star) {
    this.starSound = this.scene.sound.add('star', {
      volume: 0.6,
      loop: false,
    });
    setTimeout(() => star.destroy(), 500);
    // setTimeout(() => {
    //   if (this.flag) this.starSound.play();
    // }
    // , 250);
    if (this.flag) {
      starsData.number++;
      this.starSound.play();
    }
    this.flag = false;
  }
}
