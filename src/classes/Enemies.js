export default class Enemies {
  constructor(scene) {
    this.scene = scene;
    this.coordinates = [];
    this.enemiesGroup = scene.physics.add.group();
  }
    getCoordinates(coordinates) {
    this.coordinates.push(coordinates);
    return this.coordinates;
  }
   createGroup() {
    this.enemiesGroup = this.coordinates.map(([x, y]) => {
      const enemy = this.enemiesGroup
        .create(x, y, "enemy")
        .setOrigin(0, 0)
        .setScale(0.3, 0.3)
        .body.setAllowGravity(false)
        return enemy;
    });
   }
}