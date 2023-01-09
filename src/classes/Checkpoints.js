export default class Checkpoints {
  constructor(scene) {
    this.coordinates = [];
    this.checkpointsGroup = scene.physics.add.group();
  }
  getCoordinates(coordinates) {
    this.coordinates.push(coordinates);
    return this.coordinates;
  }
   createGroup(scene, player, callback) {
    this.checkpointsGroup = this.coordinates.map(([x, y]) => {
      const checkpoint = this.checkpointsGroup
        .create(x, y - 100, "checkpoint")
        .setOrigin(0, 0)
        .setScale(0.25, 0.25)
        return checkpoint;
    })
    .map((checkpoint) => {
      scene.physics.world.enable(checkpoint, Phaser.Physics.Arcade.DYNAMIC_BODY);
      scene.physics.add.overlap(player, checkpoint, callback, null, this);
    })
   }
}