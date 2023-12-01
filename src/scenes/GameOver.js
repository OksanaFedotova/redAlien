import Phaser from 'phaser';
import { heartsIndex } from '../utils/variables';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  preload() {
    this.load.image('retry', 'assets/images/retry.png');
  }

  create() {
    const style = { fontFamily: 'Baloo_2', fontSize: '60px', color: '#38a5c6', align: 'center' };
    const resume = () => {
      heartsIndex.value = 2;
      for (let num in heartsIndex.hearts) {
        heartsIndex.hearts[num] = 'heart';
      }
      this.scene.start('game-scene', { playerX: 300 });
      this.scene.stop();
    };
    const x = this.cameras.main.width / 2;
    const y = this.cameras.main.height / 2;
    this.add.text(x, y, 'GAME OVER', style).setOrigin(0.5, 0.5).setShadow(3, 3, '#ffffff', 5);
    this.add
      .image(x, y + 75, 'retry')
      .setScale(0.2, 0.2)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => resume());
  }

  update() {}
}
