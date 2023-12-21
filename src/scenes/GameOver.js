import Phaser from 'phaser';
// import { heartsIndex } from '../utils/hearts';
import style from '../utils/style';
// import results from '../utils/results';
import resume from '../utils/resume';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  preload() {
    //this.load.image('retry', 'assets/images/retry.png');
    this.load.image('retry', 'assets/images/button.png');
  }

  create() {
    // const resume = () => {
    //   heartsIndex.value = 2;
    //   results.score = 0;
    //   results.stars = 0;
    //   for (let num in heartsIndex.hearts) {
    //     heartsIndex.hearts[num] = 'heart';
    //   }
    //   this.scene.start('game-scene', { playerX: 180 });
    //   this.scene.stop();
    // };
    const x = this.cameras.main.width / 2;
    const y = this.cameras.main.height / 2 - 100;
    this.add.text(x, y, 'Игра окончена', style).setOrigin(0.5, 0.5).setShadow(3, 3, '#ffffff', 5);
    const button = this.add
      .image(0, 0, 'retry')
      .setScale(0.8, 0.7)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => resume(this.scene));
    const text = this.add
      .text(0, 0, 'Заново', { ...style, fontSize: '5rem', color: '#ffffff' })
      .setOrigin(0.5, 0.5);
    this.add.container(x, y + 120, [button, text]);
  }
}
