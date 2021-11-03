import Phaser from 'phaser';
import { getQuestion, shuffle, getOptions } from './auxiliary/functions';
//import { Button } from './auxiliary/button';

//variables
let crow, sky1, sky2;

let cursors;

let question, questionText, correctAnswer, answers, answersValues;
let style;
let live, hearts, mistake, heartsIndex;

let stopMusic


export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super('game-scene')
    }
 
    preload()
    {
        this.load.image('sky', 'assets/images/DaySky.png');
        this.load.image('skyTop', 'assets/images/DaySkyTop.png');

        this.load.spritesheet('crow', 'assets/images/crow.png', { frameWidth: 32, frameHeight: 32 });

        this.load.image('bubble', 'assets/images/bubble.png');

        this.load.image('start', 'assets/images/start.png');

        this.load.spritesheet('sound', 'assets/images/sound.png', { frameWidth: 365, frameHeight: 380 })

        this.load.spritesheet('heart', 'assets/images/lives.png', { frameWidth: 16, frameHeight: 14 });

        this.load.audio('theme', 'assets/audio/theme.mp3');

        this.load.audio('select', 'assets/audio/select.mp3');

        this.load.audio('wrong', 'assets/audio/wrong.mp3');


    }
 

    create()

    {   
        //audio
        this.music = this.sound.add('theme');
        this.music.play({
            loop: true,
            volume: 0.7
        });
        stopMusic = false;
       
        const select = this.sound.add('select');

        const wrong = this.sound.add('wrong');


        //lives
        heartsIndex = 0;
        live = 3;
        let y = 180;
        let x = 600;

        //style text
        style = { fontFamily: '"Baloo 2"' , fontSize: '60px', color: '#006286', align: 'center' };
        const style2 = { fontFamily: '"Baloo 2"' , fontSize: '40px', color: '#006286', align: 'center' };


        //sky
        this.add.image(0, 0, 'skyTop').setScale(1.6, 1.6).setOrigin(0, 0);
        sky1 = this.add.image(0, 200, 'sky').setScale(1.6, 1.6).setOrigin(0, 0);
        sky2 = this.add.image(800, 200, 'sky').setScale(1.6, 1.6).setOrigin(0, 0);

        
        //crow
       crow = this.physics.add.sprite(100, 300, 'crow');
       crow.setScale(2)
       this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('crow', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        //lives
        hearts = [];

        for (let i = 0; i < live; i++) {
            let x = 760 - i*38;
            hearts[i] = this.physics.add.sprite(x, 26, 'heart').setScale(2.5);
        }
  
        this.anims.create({
            key: 'disappear',
            frames: this.anims.generateFrameNumbers('heart', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: 0
        });

        //cursors
        cursors = this.input.keyboard.addKeys('UP,DOWN');

        //score
        let score = 0;
        let scoreText = this.add.text(16, 16, `Счёт: ${score}`, { fontSize: '32px', fill: '#000' });

        //levels
        let level = 5;
        let levelText = this.add.text(16, 45, `Уровень: ${level}`, { fontSize: '32px', fill: '#000' });

        //get question and answers value
        [question, correctAnswer, answersValues] = this.getRound(level);

        //question
        questionText = this.add.text(150, 120, `${question}`, style);

        //answers
        answers = answersValues.map((option) => {
        let answerText = this.add.text(25, 20, `${option}`, style).setOrigin(0, 0);
        answerText.name = 'text';
        let bubble = this.add.image(0, 0, 'bubble').setScale(0.4, 0.2).setOrigin(0, 0);
        let container = this.add.container(x, y, [bubble, answerText]);
        this.physics.world.enable(container);
        y += 120;
        return container;
        });

        //change question and options after answer
        const change = (answer, crow) => {

            if(+answer.list[1].text === correctAnswer) {
                select.play();
                score += 10;
                scoreText.setText('Счёт:' + score);

            } else {
                wrong.play();
                live -= 1;
                mistake = true;
            };

            if (score % 50 === 0 && score != 0) {
                level ++;
                if(level >= 5) {
                    level = 5;
                }
            }
            levelText.setText('Уровень:' + level);

            [question, correctAnswer, answersValues] = this.getRound(level);
            questionText.setText(`${question}`);
            answers.map((answer, i) => {
                answer.x = 600;
                let answerValue = answer.getByName('text');
                answerValue.setText(answersValues[i]);
                return answer;
            });
            if(live === 0) {

                this.gameOver();
             }
        };

        const answersGroup = this.add.group(answers);
        this.physics.add.overlap(answersGroup, crow, change, null, this);
        /*

        //pause
     
        const pause = () => {
            this.music.pause();
            this.scene.launch('pause');
            this.scene.pause();
        }

        const button = new Button(650, 550, 'Пауза', style2, this, pause, 'start');
        */

        //music off/on
        this.buttonSoundIsPressed = false;
        const soundPause = () => {
            this.buttonSoundIsPressed = true;
            this.music.pause()
            this.buttonSound.anims.play('off', false);
        }
        const soundResume = () => {
            this.buttonSoundIsPressed = false;
            this.music.play({
                    loop: true,
                    volume: 0.7
            })
            this.buttonSound.anims.play('on', false);
        }
        this.buttonSound = this.add.sprite(55, 550, 'sound').setScale(0.2, 0.2);
        this.anims.create({
            key: 'off',
            frames: this.anims.generateFrameNumbers('sound', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'on',
            frames: this.anims.generateFrameNumbers('sound', { start: 1, end: 0 }),
            frameRate: 10,
            repeat: 0
        });
        this.buttonSound.setInteractive();
        this.buttonSound.on('pointerdown', () => {
            this.buttonSoundIsPressed? soundResume(): soundPause()
        })
    }

    update() 
    {   
        if (!stopMusic) {
            if(this.music.isPaused && this.buttonSoundIsPressed === false) {
                this.music.play({
                    loop: true,
                    volume: 0.7
            })
        }

    }

      
        this.elementsFly([sky1, sky2]);

        this.elementsFly(answers);
    
        //crow
        crow.anims.play('fly', true);
        if (cursors.UP.isDown) {
            crow.y -= 2;
        } 

        else if (cursors.DOWN.isDown) {
            crow.y += 2
        }
     
        //lives 
        if(mistake) {
            hearts[heartsIndex].anims.play('disappear', false);
            mistake = false;
            heartsIndex += 1;
         }
    }
    
    getRound(level) {
     //question
    const [question, correctAnswer] = getQuestion(level);
    //answers
    const options = getOptions(correctAnswer);
    const answersValues = [correctAnswer, ...options];
    shuffle(answersValues);

    return [question, correctAnswer, answersValues];
    };

    gameOver() {
        stopMusic = true;
        this.time.delayedCall(250, function() {
            this.sound.removeAll();
            this.cameras.main.fade(250);
        }, [], this);
        // restart game
        this.time.delayedCall(500, function() {
            //this.scene.remove();
            this.scene.restart();
        }, [], this);
        return;
        }

    elementsFly(elements) {
        elements.map((element) => {
            let rect = element.getBounds();
            element.x -= 2;
                if(rect.x + rect.width <= 0) {
                    element.x = 798;
                } 
            })
          }
        

}