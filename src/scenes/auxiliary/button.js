import Phaser from 'phaser';

export class Button {
    constructor(x, y, label, style, scene, callback, name) {
        const text = scene.add.text(0, 0, label, style).setOrigin(0.5, 0.5);
        const image = scene.add.image(0, 0, name).setScale(0.3, 0.3);
        const button = scene.add.container(x, y, [image, text])
            //.setPadding(10)
            //.setStyle({ backgroundColor: '#00bfff' })
            .setInteractive(new Phaser.Geom.Rectangle(-100, -100, 400, 400), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => callback());
        //button.setSize(30, 60);
        //scene.physics.world.enable(button);
    }

}

      //start 
      //const button = new Button(400, 300, 'Старт', style, this, this.getRound.bind(this, '1'));