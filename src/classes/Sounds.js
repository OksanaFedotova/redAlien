import Phaser from 'phaser';
export default class Sounds {
  constructor(scene) {
    this.isRunning = false;
    this.isFlying = true;
    this.isFlyingOnSlope = true;
    this.scene = scene;
    this.river = true;
    this.jumps = 0;
  }
  preloadSound() {
    this.scene.load.audio('run', 'assets/audio/run.mp3');
    // this.scene.load.audio('fly', 'assets/audio/fly.mp3');
    this.scene.load.audio('jump', 'assets/audio/jump.mp3');
    this.scene.load.audio('river', 'assets/audio/river.mp3');
    this.scene.load.audio('background', 'assets/audio/background.mp3');
    this.scene.load.audio('gurgle', 'assets/audio/gurgle.mp3');
    this.scene.load.audio('hit', 'assets/audio/hit.mp3');
  }
  createSound() {
    this.runSound = this.scene.sound.add('run', {
      volume: 1,
      loop: true,
    });
    // this.flySound = this.scene.sound.add('fly', {
    //   volume: 1,
    //   loop: true,
    // });
    this.jumpSound = this.scene.sound.add('jump', {
      volume: 0.6,
      loop: false,
    });
    this.riverSound = this.scene.sound.add('river', {
      volume: 0.07,
      loop: true,
    });
    this.backgroundSound = this.scene.sound.add('background', {
      volume: 0.9,
      loop: true,
    });
    this.gurgleSound = this.scene.sound.add('gurgle', {
      volume: 1,
      loop: false,
    });
    this.hitSound = this.scene.sound.add('hit', {
      volume: 1,
      loop: false,
    });
  }
  playRiver(isRiver) {
    if (isRiver) {
      if (this.river) {
        this.riverSound.play();
        this.river = false;
      }
    } else if (!isRiver) {
      this.riverSound.stop();
      if (!isRiver) {
        this.river = true;
      }
    }
  }
  playGurgle() {
    this.gurgleSound.play();
  }
  playBackground() {
    this.backgroundSound.play();
  }
  playHit() {
    this.hitSound.play();
  }
  updateSound(cursors, player, playerDown, playerUp, slopeCurrent, isJumping) {
    if (player.body.onFloor() && this.isFlying === true) {
      this.jumpSound.play();
      this.isFlying = false;
    }
    if (!player.body.onFloor()) {
      this.jumpSound.stop();
      this.isFlying = true;
    }
    if (playerDown || playerUp) {
      if (
        !isJumping &&
        Phaser.Geom.Intersects.GetLineToRectangle(slopeCurrent, player.getBounds()).length &&
        this.isFlyingOnSlope
      ) {
        this.jumpSound.play();
        this.isFlyingOnSlope = false;
        // console.log(Phaser.Geom.Intersects.GetLineToRectangle(slopeCurrent, player.getBounds()));
        // const { y } = Phaser.Geom.Intersects.GetLineToRectangle(slopeCurrent, player.getBounds())[0];
        // if (cursors.up.isDown) {
        //   this.isFlyingOnSlope = true;
        // }
        // if (this.isFlyingOnSlope) {
        //   if (cursors.up.isUp) {
        //     this.jumpSound.play();
        //     this.isFlyingOnSlope = false;
        //   } else {
        //     this.jumps++;
        //     if (this.jumps % 3 === 0) {
        //       if (cursors.right.isDown || cursors.left.isDown) {
        //         this.jumpSound.play();
        //         this.isFlyingOnSlope = false;
        //       } else {
        //         this.jumpSound.play();
        //       }
        //     }
        //   }
        // }
      }
      if (isJumping) this.isFlyingOnSlope = true;
    }
    const playerRun = [
      (cursors.right.isDown || cursors.left.isDown) && player.body.onFloor(),
      (cursors.right.isDown || cursors.left.isDown) && (playerDown || playerUp),
    ];
    if (playerRun[0] || playerRun[1]) {
      if (!this.isRunning) {
        this.runSound.play();
        this.isRunning = true;
      }
    } else {
      this.runSound.stop();
      this.isRunning = false;
    }
  }
}
