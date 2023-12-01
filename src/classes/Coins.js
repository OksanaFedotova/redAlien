import Phaser from 'phaser';
export default class Coins {
  constructor(scene) {
    this.scene = scene;
  }
  preloadCoins() {
    this.scene.load.spritesheet('coin', 'assets/images/coin.png', {
      frameWidth: 67,
      frameHeight: 66,
    });
    this.scene.load.audio('coins', 'assets/audio/coin2.mp3');
  }
  createCoins() {
    this.scene.anims.create({
      key: 'coin',
      frames: this.scene.anims.generateFrameNumbers('coin', { start: 0, end: 14 }),
      repeat: -1,
    });
  }
  addCoins(tiles, scene, player, callback) {
    this.coinsSound = this.scene.sound.add('coins', {
      volume: 0.6,
      loop: false,
    });
    tiles
      .map(([x, y], i) => {
        if (i % 2 === 0) {
          const coin = scene.add
            .sprite(x + 30, y - 100, 'coin')
            .setOrigin(0, 0)
            .setScale(0.4, 0.4);
          coin.anims.play('coin', true);
          return coin;
        }
      })
      .filter((coin) => coin)
      .map((coin) => {
        scene.physics.world.enable(coin, Phaser.Physics.Arcade.DYNAMIC_BODY);
        coin.body.allowGravity = false;
        scene.physics.add.overlap(player, coin, callback, null, this);
        return coin;
      });
  }
}
