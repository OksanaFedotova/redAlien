export class Spikes {
  constructor(scene) {
    this.scene = scene;
    this.coordinates = [];
  }
  preloadSpikes() {
    this.scene.load.image('spike', '/assets/images/spike.png');
  }
  getCoordinates(coordinates) {
    this.coordinates.push(coordinates);
    //return this.coordinates;
  }
  generateSpikes(n, x, y) {
    for (let i = 1; i < n; ++i) {
      this.spikeGroup.create(x + 32 * i, y, 'spike').setBodySize(15, 15, true);
    }
  }
  createSpikes() {
    if (!this.coordinates) return;
    this.spikeGroup = this.scene.physics.add.group();
    this.coordinates.map(([x, y], i, arr) => {
      if (arr[i + 1] && x + 128 == arr[i + 1][0]) {
        this.generateSpikes(5, x, y);
      } else {
        this.generateSpikes(4, x, y);
      }
    });
    return this.spikeGroup;
  }
  getOverlap(player, callback) {
    this.scene.physics.add.overlap(player, this.spikeGroup, callback, null, this);
  }
}
