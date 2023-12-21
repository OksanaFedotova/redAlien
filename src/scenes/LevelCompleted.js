import Phaser from 'phaser';
import style from '../utils/style';
import results from '../utils/results';
import resume from '../utils/resume';
import data from '../utils/data';

export default class LevelCompleted extends Phaser.Scene {
  constructor() {
    super('level-completed');
  }
  init() {
    // this.level = data.level;
    // this.stopSound = data.stopSound;
    // console.log(this.level, this.stopSound)
  }
  preload() {
    this.load.image('completed', 'assets/images/back.png');
    this.load.image('star-img', 'assets/images/star-img.png');
    this.load.image('empty', 'assets/images/empty.png');
    this.load.image('score', 'assets/images/button-score.png');
    this.load.image('again', 'assets/images/again.png');
    this.load.image('next', 'assets/images/ok.png');
    this.load.image('levels', 'assets/images/levels.png');
    this.load.image('ribbon', 'assets/images/ribbon.png');
  }
  create() {
    //console.log(results, this);
    const x = this.cameras.main.width / 2;
    const y = this.cameras.main.height / 2;
    this.add.image(x, y, 'completed');
    this.add.image(x, y - 120, 'ribbon'); //.setScale(0.9);
    this.add.text(x - 190, y - 190, 'Уровень пройден', {
      ...style,
      color: '#fcfff2',
    });
    //.setShadow(3, 3, '#98FB98');

    for (let i = 0; i < 3; i++) {
      const texture = i < results.stars ? 'star-img' : 'empty';
      const star = this.add.image(x - 50 + i * 55, y - 200, texture);
      this.tweens.add({
        targets: star,
        y: y - 75,
        flipX: true,
        yoyo: false,
        duration: 500,
      });
    }
    this.add.text(x - 75, y - 20, 'Счёт:', style);
    const score = this.add.text(x + 45, y - 18, '0', { ...style, color: '#ffffff' }); //#54bb0e
    //.setOrigin(0.5, 0.5);

    this.tweens.addCounter({
      from: 0,
      to: results.score,
      duration: 1500,
      ease: 'linear',
      onUpdate: (tween) => {
        const value = Math.round(tween.getValue());
        score.setText(`${value}`);
      },
    });
    this.add
      .image(x - 130, y + 115, 'again')
      .setScale(0.4)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => resume(this.scene));

    this.add
      .image(x, y + 115, 'next')
      .setScale(0.7, 0.7)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        data.level++
        resume(this.scene);
      });

    this.add.image(x + 130, y + 115, 'levels').setScale(0.7, 0.7);
  }
}
