import Phaser from 'phaser';
import Sky from '../classes/nature/Sky';
import Clouds from '../classes/nature/Clouds';
import { Button } from '../classes/Button';
import { getData } from '../utils/vk';

const style = { fontFamily: 'Bulito', fontSize: '64px', color: '#38a5c6', align: 'center' };
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
    //levels.forEach((i) =>  this.load.image(`level`, `assets/ui/level.png`))
    this.load.image('level', 'assets/ui/level.png');
    this.load.image('lock', 'assets/images/lock.png');
    this.load.image('one-star', 'assets/images/one-star.png');
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
    if (!stars.length)
      stars = [
        { level: 1, quantity: 3 },
        { level: 2, quantity: 0 },
      ];
    for (let i = 1; i < stars.length + 1; i++) {
      new Button(x, y, { name: i, style }, this, () => this.startGame(i), 'level', {
        name: 'one-star',
        quantity: stars[i - 1].quantity,
      });
      x += 100;
      if (i % 3 === 0) {
        y += i * 40;
        x -= i * 100;
      }
    }
    for (let i = stars.length + 1; i < 7; i++) {
      new Button(x, y, { name: `lock`, img: true }, this, () => this.startGame(i), 'level');
      x += 100;
      if (i % 3 === 0) {
        y += i * 40;
        x -= i * 100;
      }
    }
    const textX = (this.cameras.main.width - 454) / 2;
    this.add.text(textX, 16, 'Выбери уровень', style);
  }

  update() {}
  startGame(level) {
    this.scene.stop();
    this.scene.start('game-scene', { level, sound: true });
  }
}
