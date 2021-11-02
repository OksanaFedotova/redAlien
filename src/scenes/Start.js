import Phaser from 'phaser';
import { Button } from './auxiliary/button';

export default class Pause extends Phaser.Scene
{
    constructor()
    {
        super('start')
    }
 
    preload()
    {
        this.load.image('start', 'assets/start.png');
    }
 
    create()

    {
      
        const style = { fontFamily: '"Baloo 2"' , fontSize: '100px', color: '#f2f3f4', align: 'center' };
        
        const resume = () =>  {
            this.scene.resume('game-scene');
            this.scene.stop();
        }

        let gameOverText = this.add.text(320, 240, 'ИГРА ОКОНЧЕНА', style);
        //const button = new Button(650, 550, 'Старт', style, this, resume, 'start');
       
    }

    update() 
    {   

        
    }
    
    
}