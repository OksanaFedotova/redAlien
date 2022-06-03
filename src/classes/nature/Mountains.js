const getMountingsSet = (scene, x, y) => {
  const mountains = [];
    for (let i = 0; i < 4; i++) {
      mountains[i] = scene.add
        .image(x, y, `mountain${i}`)
        .setOrigin(0, 0)
        .setScale(0.5);
      i % 2 ? (x += 100) : (x += 220);
      i % 2 ? (y -= 100) : (y += 100);
    }
};
export default class Mountains {
  constructor(scene, x, y) {
    this.scene = scene;
    for (let i = 0; i < 12; i++) {
      getMountingsSet(scene, x, y);
      x += 796;
    }
  }
}