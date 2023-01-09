import { Potion } from '../classes/Potion';

export default class Chests {
  constructor(scene) {
    this.scene = scene;
    this.coordinates = [];
    this.chestGroup = scene.physics.add.group();
    this.createGroup = this.createGroup.bind(this);
  }
  getCoordinates(coordinates) {
    this.coordinates.push(coordinates);
    return this.coordinates;
  }
  createGroup() {
    let i = 0;
    this.chestGroup = this.coordinates.map(([x, y]) => {
      const chest = this.chestGroup
        .create(x, y, "chest")
        .setOrigin(0, 0)
        chest.setData('index',`${i}`)
        i++;
        return chest;
    });
    const anims = this.scene.anims;
    anims.create({
      key: "chest",
      frames: anims.generateFrameNumbers("chest", { start: 4, end: 0 }),
      frameRate: 10,
      repeat: 0,
    });
    return this.chestGroup;
  }
  chestOpen(player, chest) {
      chest.anims.play("chest", false);
      let i = chest.getData('index');
      this.potion = new Potion(this, chest.x, chest.y, `potion${i}`);
      this.potion.potion.setData("superPower", i);
      this.physics.add.overlap(player, this.potion.potion, this.potion.take, null, this);
      chest.setActive(false);
      this.physics.world.disable(chest);
  }
}
