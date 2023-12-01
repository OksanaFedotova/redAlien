export default class Sky {
  constructor(scene, n, width) {
    this.scene = scene;

    let skyX = 0;
    for (let i = 0; i < n; i++) {
      scene.add.image(skyX, 0, 'sky').setOrigin(0, 0);
      skyX += width;
    }
  }
}
