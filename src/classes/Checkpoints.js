export default class Checkpoints {
  constructor(scene) {
    this.coordinates = [];
    this.checkpointsGroup = scene.physics.add.group();
    this.playerX = null;
    this.createGroup = this.createGroup.bind(this);
  }
  getCoordinates(coordinates) {
    this.coordinates.push(coordinates);
    return this.coordinates;
  }
  createGroup(scene, player, callback) {
    this.checkpointsGroup = this.coordinates
      .map(([x, y]) => {
        const checkpoint = this.checkpointsGroup
          .create(x, y - 100, 'checkpoint')
          .setOrigin(0, 0)
          .setScale(0.5, 0.5);
        return checkpoint;
      })
      .map((checkpoint) => {
        scene.physics.add.overlap(
          player,
          checkpoint,
          () => {
            callback(player, checkpoint);
            scene.physics.world.disable(checkpoint);
          },
          null,
          this
        );
        return checkpoint;
      });
  }
}
