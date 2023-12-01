import Phaser from 'phaser';

export default class Enemies {
  constructor(scene) {
    this.coordinates = [];
    this.enemiesGroup = scene.physics.add.group();
  }
  getCoordinates(coordinates) {
    this.coordinates.push(coordinates);
    return this.coordinates;
  }
  createGroup(scene, player, callback) {
    const enemiesGroup = this.coordinates
      .map(([x, y]) => {
        const enemy = this.enemiesGroup.create(x, y, 'enemy').setOrigin(0, 0);
        return enemy;
      })
      .map((enemy) => {
        scene.physics.world.enable(enemy, Phaser.Physics.Arcade.DYNAMIC_BODY);
        enemy.body.allowGravity = false;
        scene.physics.add.overlap(player, enemy, callback, null, this);
        Phaser.Display.Bounds.GetBounds(enemy).x;
        Phaser.Display.Bounds.GetBounds(enemy).y;
        enemy.setCircle(60);
        return enemy;
      });
    return enemiesGroup;
  }
}
