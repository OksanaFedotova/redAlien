import Phaser from 'phaser';
import style from '../utils/style';
import resume from '../utils/resume';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  preload() {
    this.load.image('retry', 'assets/images/button.png');
  }

  create() {
    const x = this.cameras.main.width / 2;
    const y = this.cameras.main.height / 2 - 100;
    this.add.text(x, y, 'Игра окончена', style).setOrigin(0.5, 0.5).setShadow(3, 3, '#ffffff', 5);
    const button = this.add
      .image(0, 0, 'retry')
      .setScale(0.8, 0.7)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => resume(this.scene));
    const text = this.add
      .text(0, 0, 'Заново', { ...style, fontSize: '4rem', color: '#ffffff' })
      .setOrigin(0.5, 0.5);
    this.add.container(x, y + 120, [button, text]);
  }
}
