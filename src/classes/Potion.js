export let superPower = null;

export class Potion {
  constructor(scene, x, y, img) {
    this.scene = scene;
    this.potion = scene.physics.add
        .sprite(x + 10, y, img)
        .setScale(0.2, 0.2)
        .setOrigin(0, 0);
        scene.physics.world.enable(this.potion);
        this.potion.body.setAllowGravity(false);

    this.take = this.take.bind(this); //переделать
  }
 
  take(player, potion) {
    const i = potion.getData('superPower');
    setTimeout(() => potion.destroy(), 500);
    switch (+i) {
      case 2:
        superPower = {
          run: Date.now() + 45000
        }
        break;
      case 3:
        superPower = {
          jump: Date.now() + 45000
        }  
        break;
      case 0:
        superPower = {
          life: true,
        }  
      case 1: 
      superPower = {
          armor: true,
        }  
      default:
        break;
    }
      console.log(+i, superPower)
  }
}
