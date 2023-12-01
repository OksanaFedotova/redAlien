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
      .sprite(700, 450, 'left')
      .setScale(0.1, 0.1)
      .setInteractive()
      .setScrollFactor(0, 0);
    this.left.on('pointerdown', () => this.leftFlag = true);
    this.left.on('pointerup', () => (this.leftFlag = false));

    this.right = this.scene.add
      .sprite(770, 450, 'right')
      .setScale(0.1, 0.1)
      .setInteractive()
     .setScrollFactor(0, 0);
    this.right.on('pointerdown', () => this.rightFlag = true);
    this.right.on('pointerup', () => {
      this.rightFlag = false;
      console.log(this.rightFlag);
    });

    this.up = this.scene.add
      .sprite(735, 400, 'up')
      .setScale(0.1, 0.1)
      .setInteractive()
      .setScrollFactor(0, 0);
    this.up.on('pointerdown', () => this.upFlag = true);
  }
  updateControl() {
    this.upFlag = false;
    //console.log(this.rightFlag);
  }
}