export default class Enviroment {
  constructor(scene, ground) {
    this.scene = scene;

    ground.map(([x, y], i) => {
      if (i % 10 === 0 && y > 750) {
        const tree = scene.physics.add
          .sprite(x - 50, y - 245, "tree")
          .setOrigin(0, 0);
        tree.body.allowGravity = false;
      }
      if (i % 3 === 0) {
        const grass1 = scene.add
          .image(x + 10, y - 3, "grass1")
          .setOrigin(0, 0)
          .setScale(0.5, 0.5);
      }
    });
  }
}
