export default class Coins {
  constructor (scene, x, y, img) {
    scene.anims.create({
      key: "coin",
      frames: scene.anims.generateFrameNumbers("coin", { start: 0, end: 14 }),
      repeat: -1,
    });
  }
  addCoins(tiles, scene, player, callback) {
   const coins = tiles
      .map(([x, y], i) => {
        if (i % 3 === 0) {
          const coin = scene.add
            .sprite(x + 30, y - 100, "coin")
            .setOrigin(0, 0)
            .setScale(0.3, 0.3);
          coin.anims.play("coin", true);
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