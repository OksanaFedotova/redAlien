export default class Player {
  constructor(scene, x, y, img) {
    this.player = scene.physics.add.sprite(x, y, img).setScale(0.5, 0.5);
    //this.player.setBounce(0.2);

    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers(img, { start: 0, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: 'turn',
      frames: [{ key: img, frame: 9 }],
      frameRate: 10,
    });
    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers(img, { start: 10, end: 18 }),
      frameRate: 10,
      repeat: -1,
    });
    this.isJumping = false;
    this.momentY = 0;
    this.isOnTheSlope = false;
    this.isFalling = false;
  }
  move(cursors, playerUp, playerDown, speed) {
    if (playerUp || playerDown) {
      this.player.body.allowGravity = false;
    }
    if (cursors.left.isDown && this.player.x > 0) {
      if (playerUp) {
        this.moveDiagonalLeft(speed);
        this.player.anims.play('left', true);
      } else if (playerDown) {
        this.moveDiagonalLeftUp(speed);
        this.player.anims.play('left', true);
      } else {
        this.player.setVelocityX(-speed);
        this.player.anims.play('left', true);
      }
    } else if (cursors.right.isDown && this.player.x < 9600) {
      if (playerUp) {
        this.moveDiagonalRight(speed);
        this.player.anims.play('right', true);
      } else if (playerDown) {
        this.moveDiagonalRightDown(speed);
        this.player.anims.play('right', true);
      } else {
        this.player.setVelocityX(speed);
        this.player.anims.play('right', true);
      }
    } else {
      this.player.setVelocityX(0);
      if (playerUp || playerDown) {
        this.player.body.stop();
      }
      this.player.anims.play('turn');
    }
  }
  moveDiagonalRight(speed) {
    this.player.setVelocityX(speed);
    this.player.setVelocityY(-speed);
  }
  moveDiagonalLeft(speed) {
    this.player.setVelocityX(-speed);
    this.player.setVelocityY(speed);
  }
  moveDiagonalRightDown(speed) {
    this.player.setVelocityX(speed);
    this.player.setVelocityY(speed);
  }
  moveDiagonalLeftUp(speed) {
    this.player.setVelocityX(-speed);
    this.player.setVelocityY(-speed);
  }
  jump(cursors, playerUp, playerDown) {
    if (cursors.up.isDown && (playerDown || playerUp)) {
      this.isJumping = true;
      this.momentY = this.player.y;
    }
    if (this.momentY - this.player.y > 30 && !playerUp && !playerDown) {
      this.isJumping = false;
      this.isFalling = true;
    }
    if (this.isJumping) {
      this.player.setVelocityY(-450);
    }
  }
}
