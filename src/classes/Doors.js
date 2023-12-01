export default class Doors {
  constructor(scene) {
    this.coordinates = [];
    this.doorsGroup = scene.physics.add.group();
    this.createGroup = this.createGroup.bind(this);
  }
  getCoordinates(coordinates) {
    this.coordinates.push(coordinates);
    return this.coordinates;
  }
  createGroup(scene, player, callback) {
    this.doorsGroup = this.coordinates
      .map(([x, y], i) =>
        this.doorsGroup
          .create(x, y - 200, 'door')
          .setOrigin(0, 0)
          .setData('index', `${i + 1}`)
      )
      .map((door) => {
        scene.physics.add.overlap(player, door, callback, null, this);
        return door;
      });
  }
}
