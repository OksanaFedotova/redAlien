export default class Doors {
  constructor(scene) {
    this.scene = scene;
  }
  preloadDoor() {
    this.scene.load.image('door', 'assets/images/door.png');
  }
  createDoor() {
    this.sprite = this.scene.physics.add.sprite(9200, 500, 'door').setSize(128, 150);
  }
  addOverlap(player, callback) {
    this.scene.physics.add.overlap(
      player,
      this.sprite,
      () => {
        this.scene.scene.pause();
        this.scene.scene.launch('level-completed');
        callback();
      },
      null,
      this.scene
    );
  }
}
