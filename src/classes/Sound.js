export class Sound {
  constructor(scene) {
    this.scene = scene;
    this.buttonSoundIsPressed = false;
  }
  soundPause() {
    this.buttonSoundIsPressed = true;
    this.music.pause();
    this.buttonSound.anims.play('off', false);
  }
}
//music off/on

const soundPause = () => {};
const soundResume = () => {
  this.buttonSoundIsPressed = false;
  this.music.play({
    loop: true,
    volume: 0.7,
  });
  this.buttonSound.anims.play('on', false);
};
this.buttonSound = this.add.sprite(55, 550, 'sound').setScale(0.2, 0.2);
this.anims.create({
  key: 'off',
  frames: this.anims.generateFrameNumbers('sound', { start: 0, end: 1 }),
  frameRate: 10,
  repeat: 0,
});
this.anims.create({
  key: 'on',
  frames: this.anims.generateFrameNumbers('sound', { start: 1, end: 0 }),
  frameRate: 10,
  repeat: 0,
});
this.buttonSound.setInteractive();
this.buttonSound.on('pointerdown', () => {
  this.buttonSoundIsPressed ? soundResume() : soundPause();
});
