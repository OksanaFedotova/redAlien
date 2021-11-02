import Phaser from 'phaser';
import { Button } from './auxiliary/button';

let camera;
let gameOverText;

export default class Pause extends Phaser.Scene
{
    constructor()
    {
        super('game-over')
    }
 
    preload()
    {

    }
 
    create()

    {
      
        const style = { fontFamily: '"Baloo 2"' , fontSize: '60px', color: '#f2f3f4', align: 'center' };
        
        const resume = () =>  {
            this.scene.start('game-scene');
            this.scene.stop();
        }
        const x =  this.cameras.main.width / 2;
        const y = this.cameras.main.height / 2;
        gameOverText = this.add.text(x, y, 'ИГРА ОКОНЧЕНА', style).setOrigin(0.5, 0.5).setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    
        const button = new Button(x, y + 70, 'НАЧАТЬ ЗАНОВО', style, this, resume, null);
    }

    update() 
    {   

        
    }
    
    
}