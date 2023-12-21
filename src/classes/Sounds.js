import Phaser from 'phaser';
export default class Sounds {
  constructor(scene) {
    this.scene = scene;
    this.isRunning = false;
    this.isFlying = true;
    this.isFlyingOnSlope = true;
    this.river = true;
    this.jumps = 0;
    this.stopRun = this.stopRun.bind(this);
  }
  preloadSound() {
    this.scene.load.audio('run', 'assets/audio/run.mp3');
    this.scene.load.audio('jump', 'assets/audio/jump.mp3');
    this.scene.load.audio('river', 'assets/audio/river.mp3');
    this.scene.load.audio('background', 'assets/audio/background.mp3');
    this.scene.load.audio('gurgle', 'assets/audio/gurgle.mp3');
    this.scene.load.audio('hit', 'assets/audio/hit.mp3');
    this.scene.load.audio('checkpoint', 'assets/audio/checkpoint.wav');
  }
  createSound() {
    this.runSound = this.scene.sound.add('run', {
      volume: 1,
      loop: true,
    });
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
    this.checkpointSound = this.scene.sound.add('checkpoint', {
      volume: 1,
      loop: false,
    });
  }
  playRiver(isRiver, stopSound) {
    if (stopSound) {
      this.riverSound.stop()
    } else {
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
  }
  playGurgle(stopSound) {
     if (stopSound) {
    this.gurgleSound.stop();
     } else {
      this.gurgleSound.play();
     }
  }
  playBackground(stopSound) {
     if (stopSound) {
    this.backgroundSound.stop();
     } else {
      this.backgroundSound.play();
     }
  }
  playHit(stopSound, flag) {
     if (stopSound) {
    this.hitSound.stop();
     } else {
      if (!flag) this.hitSound.play();
      flag = true;
     }
  }
  playCheckpoint(stopSound) {
    if (stopSound) {
      this.checkpointSound.stop()
    } else {
      this.checkpointSound.play()
    }
  }
  updateSound(cursors, player, playerDown, playerUp, slopeCurrent, isJumping, stopSound) {
    if (stopSound) this.scene.game.sound.stopAll();
    if (player.body.onFloor() && this.isFlying === true) {
    if (!stopSound) {
      this.jumpSound.play();
      this.isFlying = false;
    }
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
        if (!stopSound) {
          this.jumpSound.play();
          this.isFlyingOnSlope = false;
        }
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
  stopRun() {
    this.runSound.stop();
  }
}
