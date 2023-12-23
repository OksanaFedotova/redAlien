import Phaser from 'phaser';
import Sky from '../classes/nature/Sky';
import Clouds from '../classes/nature/Clouds';
import Button from '../classes/Button';
import { getData } from '../utils/vk';
import results from '../utils/results';
import style from '../utils/style';
import data from '../utils/data';

export default class LevelSelect extends Phaser.Scene {
  constructor() {
    super('level-select');
  }
  preload() {
    //sky
    this.load.image('sky', 'assets/images/Sky.png');
    //cloud
    this.load.image('cloud', 'assets/images/Cloud_1.png');
    this.load.image('cloud2', 'assets/images/Cloud_2.png');
    //levels
    this.load.image('level', 'assets/ui/level.png');
    this.load.image('lock', 'assets/images/lock.png');
    this.load.image('one-star', 'assets/images/one-star.png');
    this.load.image('empty-star', 'assets/images/empty-star.png');
  }
  async create() {
    //level size
    this.cameras.main.setBounds(0, 0, 2048, 1024);
    new Sky(this, 2, 1920);
    //clouds
    new Clouds(this, 'cloud', 0, 100);
    new Clouds(this, 'cloud2', 350, 300);
    new Clouds(this, 'cloud', 200, 500);

    let x = this.cameras.main.width / 2 - 100;
    let y = this.cameras.main.height / 2 - 45; // высота контейнера / 8
    // eslint-disable-next-line no-unused-vars
    let stars = await getData(['stars']);
    for (let i = 0; i < 6; i++) {
      if (i < results.length || i == 0) {
        new Button(
            x,
            y,
            { name: i + 1, style },
            this,
            () => {
              data.level = i + 1;
              this.startGame();
            },
            'level',
            {
              name: 'one-star',
              quantity: results[i]?.stars,
            }
          );
      }
      else {
          new Button(x, y, { name: `lock`, img: true }, this, null, 'level');
      }
      x += 100;
      if ((i + 1) % 3 === 0) {
        y += i * 40;
        x -= (i + 1) * 100;
      }
    }
    const textX = (this.cameras.main.width - 370) / 2;
    this.add.text(textX, 50, 'Выбери уровень', style);
  }

  startGame() {
    this.scene.stop();
    this.scene.start('game-scene');
  }
}
