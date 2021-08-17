import Phaser from 'phaser';
import { getQuestion, shuffle, calculate, getRandomInt } from './auxiliary/functions';



let crow, clouds, cursors, answersValues, answers, scoreText, correctAnswerVal;
let score = 0;

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

        this.load.image('bubble', 'assets/bubble.png');

    }
 
    create()

    {

        //style text
        const style = { fontFamily: '"Baloo 2"' , fontSize: '60px', color: '#006286', align: 'center' };
        
        //sky
        this.add.image(400, 300, 'sky');

        //clouds
        this.cloud1 = this.add.image(800, 70, 'cloud1').setScale(0.3, 0.3);
        this.cloud2 = this.add.image(600, 100, 'cloud2').setScale(0.3, 0.3);
        this.cloud3 = this.add.image(400, 80, 'cloud3').setScale(0.3, 0.3);
        this.cloud4 = this.add.image(200, 470, 'cloud4').setScale(0.3, 0.3);
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
        this.questionText = this.add.text(150, 120, `${question}`, style);

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
        
        correctAnswerVal = correctAnswer;

        answersValues = getOptions(correctAnswer);
        shuffle(answersValues);
        let y = 220;
        answers = answersValues.map((option) => {
            let answerText = this.add.text(0, 0, `${option}`, style).setOrigin(0.5, 0.5);
            let bubble = this.physics.add.image(0, 0, 'bubble').setScale(0.14, 0.14);
            let container = this.add.container(600, y, [bubble, answerText])
            y += 90;
            return container;
        });

        //cursors
        cursors = this.input.keyboard.addKeys('UP,DOWN');

        //score
        scoreText = this.add.text(16, 16, 'Счёт: 0', { fontSize: '32px', fill: '#000' });

    
    }

    update() 
    {   //clouds
        clouds = [this.cloud1, this.cloud2, this.cloud3, this.cloud4, this.cloud5]
        elementsFly(clouds);
        elementsFly(answers)
       
        //crow
        crow.anims.play('fly', true);
        if (cursors.UP.isDown) {
            crow.y -= 2;
        } 

        else if (cursors.DOWN.isDown) {
            crow.y += 2
        }

        answers.map((container) => {
            if(Phaser.Geom.Intersects.RectangleToRectangle(container.getBounds(), crow.getBounds())) {
                if(+container.list[1].text === correctAnswerVal) {
                    score += 10;
                    scoreText.setText('Счёт:' + score);
                    container.destroy()
                } 
                else {
                    container.destroy()
                }
            }
        })
    }

}
/*

*/