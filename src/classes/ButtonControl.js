import Phaser from 'phaser';
const scale = 0.15;
const y = 425;
export default class ButtonControl {
  constructor(scene) {
    this.scene = scene;
    this.leftFlag = false;
    this.rightFlag = false;
    this.upFlag = false;
  }
  preloadControl() {
    this.scene.load.image('left', 'assets/images/left.png');
    this.scene.load.image('right', 'assets/images/right.png');
    this.scene.load.image('up', 'assets/images/up.png');
  }
  createControl() {
    this.left = this.scene.add
      .sprite(50, y, 'left')
      .setScale(scale, scale)
      .setInteractive()
      .setScrollFactor(0, 0)
      .setName('left');
    //this.left.on('pointerdown', () => this.leftFlag = true);
    // this.left.on('pointerup', () => (this.leftFlag = false));

    this.right = this.scene.add
      .sprite(155, y, 'right')
      .setScale(scale, scale)
      .setInteractive()
      .setScrollFactor(0, 0)
      .setName('right');
    //this.right.on('pointerdown', () => this.rightFlag = true);
    // this.right.on('pointerup', () => this.rightFlag = false);

    this.up = this.scene.add
      .sprite(735, y, 'up')
      .setScale(scale, scale)
      .setInteractive()
      .setScrollFactor(0, 0)
      .setName('up');
    // this.up.on('pointerdown', () => this.upFlag = true);

    this.scene.input.addPointer(2);
    this.scene.input.on('gameobjectdown', (pointer, gameObject) => {
      switch (gameObject.name) {
        case 'up':
          this.upFlag = true;
          break;
        case 'left':
          this.leftFlag = true;
          break;
        case 'right':
          this.rightFlag = true;
          break;
      }
      gameObject.setTintFill(0xffff00, 0xffff00, 0xff0000, 0xff0000);
    });
    this.scene.input.on('gameobjectup', (_pointer, gameObject) => {
      this.clear(gameObject);
    });
    this.scene.input.on('gameobjectout', (_pointer, gameObject) => {
      this.clear(gameObject);
    });
  }
  updateControl() {
    this.upFlag = false;
  }
  clear(gameObject) {
    switch (gameObject.name) {
      case 'up':
        this.upFlag = false;
        break;
      case 'left':
        this.leftFlag = false;
        break;
      case 'right':
        this.rightFlag = false;
        break;
    }
    gameObject.clearTint();
  }
}
