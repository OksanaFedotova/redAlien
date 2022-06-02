const hearts = {
    0: "heart",
    1: "heart",
    2: "heart",
}

export default class Lives {
  
  constructor(scene, x = 760, y = 50) {

    this.scene = scene;

    this.heartsImages = Object.values(hearts).map((heart) => {
      const heartImage = scene.add.sprite(x, y, heart)
        .setScale(0.25)
        .setScrollFactor(0, 0);
        x -= 38;
        return heartImage;
    });

    const anims = scene.anims;
    anims.create({
      key: 'disappear',
      frames: anims.generateFrameNumbers('heart', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: 10
    })

  }

  lose(i) {
    this.heartsImages[i].anims.play('disappear', false);
    hearts[`${i}`] = 'blackHeart';
  }

}