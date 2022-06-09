// let potion;

// const superPower = {
//   jump: 0,
//   run: 0,
//   life: false,
// };


 
//     let i = 0;
//     //open chest
//     const chestOpen = (player, chest) => {
//       chest.anims.play("chest", false);
//       //console.log(chestGroup.children.keys)
//       potion = this.add
//         .image(chest.x + 10, chest.y, `potion${i}`)
//         .setScale(0.2, 0.2)
//         .setOrigin(0, 0);
//       i++;
//       this.physics.world.enable(potion);
//       potion.body.setAllowGravity(false);
//       this.physics.add.overlap(player, potion, takePotion, null, this);

//       chest.setActive(false);
//       this.physics.world.disable(chest);

//     };

  
export default class Chests {
  constructor(scene) {
    this.scene = scene;
    this.coordinates = [];
    this.chestGroup = scene.physics.add.group();
    //console.log(this.chestGroup)
  }
  getCoordinates(coordinates) {
    this.coordinates.push(coordinates);
    return this.coordinates;
  }
  createGroup() {
    this.chestGroup = this.coordinates.map(([x, y]) => {
      const chest = this.chestGroup
        .create(x, y, "chest")
        .setOrigin(0, 0)
        .setScale(0.3, 0.3);
        return chest;
    });
    const anims = this.scene.anims;
    anims.create({
      key: "chest",
      frames: anims.generateFrameNumbers("chest", { start: 5, end: 0 }),
      frameRate: 10,
      repeat: 0,
    });
    return this.chestGroup;
  }
}