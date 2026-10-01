import style from '../utils/style';

function formatTime(seconds) {
  // Minutes
  var minutes = Math.floor(seconds / 60);
  // Seconds
  var partInSeconds = seconds % 60;
  // Adds left zeros to seconds
  partInSeconds = partInSeconds.toString().padStart(2, '0');
  // Returns formated time
  return `${minutes}:${partInSeconds}`;
}

export default class Potion {
  constructor(scene) {
    this.scene = scene;
  }
  preloadPotion() {
    this.scene.load.image('potion', '/assets/images/potion.png');
  }
  createPotion(x, y) {
    this.potion = this.scene.physics.add.sprite(x, y, 'potion').setScale(0.2, 0.2);
    this.potion.body.setAllowGravity(false);
  }
  takePotion(player, playerObj) {
    this.scene.physics.add.overlap(player, this.potion, () => {
      this.potion.destroy();
      this.initialTime = 150;
      playerObj.setVelocityY(650);
      const text = `Супер прыжок: ${formatTime(this.initialTime)}`;
      this.text = this.scene.add
        .text(550, 58, text, { ...style, fontSize: 24 })
        .setScrollFactor(0, 0);
      this.potionAction = this.scene.time.addEvent({
        delay: 1000,
        callback: () => {
          this.initialTime -= 1;
          this.text.setText(`Супер прыжок: ${formatTime(this.initialTime)}`);
          if (this.initialTime === 0) {
            playerObj.setVelocityY(450);
            this.potionAction.remove(false);
          }
        },
        callbackScope: this,
        loop: true,
      });
    });
  }
  removePotion(playerObj) {
    if (!this.potionAction) return;
    this.potionAction.remove();
    this.text.setVisible(false);
    playerObj.setVelocityY(450);
  }
}
