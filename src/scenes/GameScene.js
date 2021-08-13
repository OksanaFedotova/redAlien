import Phaser from 'phaser';
import { getQuestion, shuffle, calculate, getRandomInt, loadFont } from './auxiliary/functions';



let crow, clouds, cursors, answersValues;

function elementsFly (elements) {
    elements.map((element) => {
        let rect = element.getBounds();
        element.x -= 2;
        if(rect.x+rect.width <= 0) {
            element.x = 800 - element.originX
        } 
    })
}

const getProblem = (level) => {

    const [randomNumberOne, randomNumberTwo, operator] = getQuestion(level)
    const question = `${randomNumberOne} ${operator} ${randomNumberTwo}`;
    const correctAnswer = calculate(randomNumberOne, operator, randomNumberTwo);
    return [question, correctAnswer];
  };
  

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super('game-scene')
    }
 
    preload()
    {
        this.load.image('sky', 'assets/sky.png');

        for (let i = 1; i <= 5; i++) {
            this.load.image(`cloud${i}`, `assets/cloud${i}.png`);
        }

        this.load.spritesheet('crow', 'assets/crow.png', { frameWidth: 32, frameHeight: 32 });

    }
 
    create()

    {

        //google fonts
        

        //style text
        const style = { fontFamily: 'Baloo 2', fontSize: '60px', fill: 'blu' };
        
        //sky
        this.add.image(400, 300, 'sky');

        //clouds
        this.cloud1 = this.add.image(800, 70, 'cloud1').setScale(0.3, 0.3);
        this.cloud2 = this.add.image(600, 100, 'cloud2').setScale(0.3, 0.3);
        this.cloud3 = this.add.image(400, 80, 'cloud3').setScale(0.3, 0.3);
        this.cloud4 = this.add.image(200, 450, 'cloud4').setScale(0.3, 0.3);
        this.cloud5 = this.add.image(300, 550, 'cloud5').setScale(0.3, 0.3);

        //crow
       crow = this.physics.add.sprite(100, 300, 'crow');
       crow.setScale(2)
       this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('crow', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        //question
        const [question, correctAnswer] = getProblem('1')
        this.questionText = this.add.text(300, 120, `${question}`, style);
        //this.questionText.setText(question);

        //answers
        const getOptions = (correctAnswer) => {
            let option1 = getRandomInt(correctAnswer + 5);
            let option2 = getRandomInt(correctAnswer + 6);
            if (option1 === correctAnswer || option1 === option2 || option2 === correctAnswer) {
                while(option1 === correctAnswer || option1 === option2 || option2 === correctAnswer) {
                    option1 = getRandomInt(correctAnswer + 6);
                    option2 = getRandomInt(correctAnswer + 5);
                }
            }
            
            return [option1, option2, correctAnswer];
        };

        answersValues = shuffle(getOptions(correctAnswer));


        let y = 200;
        answersValues.map((option) => {
            this.answerText = this.add.text(600, y, `${option}`, style);
            y += 80;
            return this.answerText;
        });

        //cursors
        cursors = this.input.keyboard.addKeys('UP,DOWN');

    }

    update() 
    {   //clouds
        clouds = [this.cloud1, this.cloud2, this.cloud3, this.cloud4, this.cloud5]
        elementsFly(clouds);

        //crow
        crow.anims.play('fly', true);

        if (cursors.UP.isDown) {
            crow.y -= 2;
            //crow.x += 2
        }

        //question
        //answers
        //elementsFly(arrAnswers);
    }

}

