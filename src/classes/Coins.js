import Phaser from 'phaser';
export default class Coins {
  constructor(scene) {
    this.scene = scene;
  }
  preloadCoins() {
    this.scene.load.spritesheet('coin', '/assets/images/coin.png', {
      frameWidth: 67,
      frameHeight: 66,
    });
    this.scene.load.audio('coins', '/assets/audio/coin2.mp3');
  }
  createCoins() {
    this.scene.anims.create({
      key: 'coin',
      frames: this.scene.anims.generateFrameNumbers('coin', { start: 0, end: 14 }),
      repeat: -1,
    });
  }
  addCoins(tiles, scene, player, callback, avoidPoints = [], radiusX = 120, radiusY = 200) {
    this.coinsSound = this.scene.sound.add('coins', { volume: 0.6, loop: false });

    tiles.forEach(([x, y], i) => {
      if (i % 2 !== 0) return;

      const cx = x + 30;
      const cy = y - 100;

      const nearEnemy = avoidPoints.some(
        ([ex, ey]) => Math.abs(cx - ex) < radiusX && Math.abs(cy - ey) < radiusY
      );
      if (nearEnemy) return;

      const coin = scene.add.sprite(cx, cy, 'coin').setOrigin(0, 0).setScale(0.4, 0.4);
      coin.anims.play('coin', true);

      scene.physics.world.enable(coin, Phaser.Physics.Arcade.DYNAMIC_BODY);
      coin.body.allowGravity = false;
      scene.physics.add.overlap(player, coin, callback, null, this);
    });
  }
}
