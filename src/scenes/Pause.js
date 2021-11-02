import Phaser from 'phaser';
import { Button } from './auxiliary/button';

export default class Pause extends Phaser.Scene
{
    constructor()
    {
        super('pause')
    }
 
    preload()
    {
        this.load.image('start', 'assets/start.png');
        this.load.audio('theme', 'assets/audio/theme.mp3');
    }
 
    create()

    {           //audio
        this.music = this.sound.add('theme');

      
        const style = { fontFamily: '"Baloo 2"' , fontSize: '40px', color: '#006286', align: 'center' };
        

        const resume = () =>  {
            this.scene.resume('game-scene');
            this.scene.stop();

        }
        const button = new Button(650, 550, 'Старт', style, this, resume, 'start');
       
    }

    update() 
    {   

    }
    
    
}