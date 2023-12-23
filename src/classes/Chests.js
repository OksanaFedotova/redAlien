import { Stars } from './Stars';
import results from '../utils/results';
import data from '../utils/data';

export default class Chests {
  constructor(scene) {
    this.scene = scene;
    this.coordinates = [];
    this.chestGroup = scene.physics.add.group();
    this.createGroup = this.createGroup.bind(this);
    this.chestOpen = this.chestOpen.bind(this);
  }
  preloadChests() {
    //chest
    this.scene.load.spritesheet('chest', 'assets/images/chest.png', {
      frameWidth: 128,
      frameHeight: 153,
    });
    //stars
    for (let i = 0; i < 4; i++) {
      this.scene.load.spritesheet('star', 'assets/images/star.png', {
        frameWidth: 124,
        frameHeight: 124,
      });
    }
    this.scene.load.audio('chest', 'assets/audio/chest.mp3');
    this.scene.load.audio('star', 'assets/audio/star.mp3');
  }
  getCoordinates(coordinates) {
    this.coordinates.push(coordinates);
    return this.coordinates;
  }
  createGroup() {
    let i = 0;
    this.chestGroup = this.coordinates.map(([x, y]) => {
      const chest = this.chestGroup
        .create(x + 32, y - 128, 'chest')
        .setScale(0.5, 0.5)
        .setOrigin(0, 0)
        .setData('index', `${i}`);
      i++;
      return chest;
    });
    const anims = this.scene.anims;
    anims.create({
      key: 'chest',
      frames: anims.generateFrameNumbers('chest', { start: 4, end: 0 }),
      frameRate: 10,
      repeat: 0,
    });
    return this.chestGroup;
  }

  chestOpen(player, chest) {
    this.chestSound = this.scene.sound.add('chest', {
      volume: 0.6,
      loop: false,
    });
    chest.anims.play('chest', false);
    this.chestSound.play();
    //let i = chest.getData('index');
    const star = new Stars(this.scene, chest.x, chest.y, `star`);
    star.create();
    this.scene.physics.add.overlap(player, star.star, star.take, null, this);
    chest.setActive(false);
    this.scene.physics.world.disable(chest);
    results[data.level - 1].stars++;
    console.log(results);
  }
}
