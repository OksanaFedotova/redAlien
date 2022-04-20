import Phaser from 'phaser';
import { getRange, getOverlap, getRandomArbitrary } from '../auxiliary';

//variables
let player, cursors;
let dangerousTiles;

let heartsImages = [];
let heartsIndex = 2;
let gameOver;
const hearts = {
    0: "heart",
    1: "heart",
    2: "heart",
}
let coins, potion;
const chests = [];
const leftSlopes = [];
const rightSlopes = [];
let score, scoreText
score = 0;
const superPower = {
    jump: 0,
    run:  0, 
    life: false,
}

function collectCoins (player, coin) { 
    coin.destroy();
    score += 10;
    scoreText.setText('score:' + score);
}
function takePotion (player, potion) {
    setTimeout(() => potion.destroy(), 500 )
    superPower.jump = Date.now() + 45000;
    //console.log(superPower.time)

}
export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super('game-scene')
    }
 
    preload()
    {   
        //sky
        this.load.image('sky', 'assets/images/Sky.png');
        //cloud
        this.load.image('cloud', 'assets/images/Cloud_1.png');
        this.load.image('cloud2', 'assets/images/Cloud_2.png');
        //player
        this.load.spritesheet('dude', 'assets/images/dude.png', { frameWidth: 32, frameHeight: 48 });
        //hills
        this.load.image('hill', 'assets/images/Hills_1.png');
        this.load.image('hill2', 'assets/images/Hills_2.png');
        //mountain
        for (let i = 0; i < 4; i++) {
            this.load.image(`mountain${i}`, `assets/images/Mountain_${i+1}.png`);
        }
        //hill left
        this.load.image('hillLeft', 'assets/images/GrassHillLeft.png');

        //heart
        this.load.spritesheet('heart', 'assets/images/hearts.png', { frameWidth: 120, frameHeight: 104 });
        this.load.image('blackHeart', 'assets/images/blackHeart.png');

        //environment
        this.load.image('tree', 'assets/images/environment/tree.png');
        this.load.image('grass1', 'assets/images/environment/grass1.png');

        //coins
        this.load.spritesheet('coin', 'assets/images/coin.png', { frameWidth: 67, frameHeight: 66});

        //chest
        this.load.spritesheet('chest', 'assets/images/chest3.png', { frameWidth: 132, frameHeight: 156});

        //potions
        for (let i = 0; i < 4; i++) {
            this.load.image(`potion${i}`, `'assets/images/potions/potion${i}.png`);
        }

        //enemy
        this.load.image('enemy', 'assets/images/enemy.png')

        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        // tiles in spritesheet 
        this.load.image('tiles', 'assets/tiles.png');

        //plugin for animation
        this.load.scenePlugin('AnimatedTiles', 'https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');    
    }
 
    create()
    { 
        gameOver = true
        
        //level size
        this.cameras.main.setBounds(0, 0, 9600, 1024);

        //sky
        let skyX = 0;
        for (let i = 0; i < 5; i++) {
            const sky = this.add.image(skyX, 0, 'sky').setOrigin(0, 0);
            skyX += 1920;
        }
        
        //clouds
        const generateClouds = (cloudImg, x, y, scale) => {
            for (let i = 0; i < 100; i++) {
                const cloud = this.add.image(x, y, cloudImg).setOrigin(0, 0).setScale(scale);
                const sign = Math.round(getRandomArbitrary(0, 1));
                sign? y += getRandomArbitrary(50, 150): y -= getRandomArbitrary(50, 150);
                y > 700? y = 700: y;
                y < 100? y = 100: y;
                x += getRandomArbitrary(200, 300);
            }
        }
        generateClouds('cloud', 100, 200, 0.3);
        generateClouds('cloud2', 200, 300, 0.5);

        //mountains
        let mountainX = 0;
        let mountainY = 600;
        const getMountingsSet = (x, y) => {
            const mountains = [];
            for (let i = 0; i < 4; i++) {
                mountains[i] = this.add.image(x, y, `mountain${i}`).setOrigin(0, 0).setScale(0.5);
                i % 2? x += 100: x += 220
                i % 2? y-= 100: y += 100;
            };
        };
        for (let i = 0; i < 12; i ++) {
            getMountingsSet(mountainX, mountainY);
            mountainX += 796;
        }
        
        //clouds
        generateClouds('cloud', 150, 450, 0.5);
        generateClouds('cloud2', 50, 550, 0.3);
        
        
        //hills
        let hillX = 0;
        for (let i = 0; i < 11; i++) {
            const hill2 = this.add.image(hillX, 500, 'hill2').setOrigin(0, 0).setScale(0.5);
            const hill = this.add.image(hillX, 450, 'hill').setOrigin(0, 0).setScale(0.5);
            hillX += 960;
        };

        //map and tileset
        const map = this.make.tilemap({key: 'map'});
        const tileSet = map.addTilesetImage("tiles", "tiles");
        const ground = map.createLayer('ground', tileSet, 0, 0).setScale(0.5);

        this.animatedTiles.init(map);

        //tileMap
        let coordinates = [];
        let collidedTiles = [];

        ground.forEachTile((tile) => {

            //collided tiles
            if (tile.properties.collides) {
                collidedTiles.push([tile.pixelX/2, tile.pixelY/2]);
   
            }
           //dangerous tiles
            else if(tile.properties.dangerous) {
                coordinates.push([tile.pixelX/2, tile.pixelY/2]);
            }

            //hills
            else if(tile.properties.hill) {
                switch (tile.properties.hill) {
                    case 'left':
                        let xLeft = tile.pixelX/2;
                        let yLeft = tile.pixelY/2;
                        const slopeLeft = new Phaser.Geom.Line(xLeft, yLeft + 64, xLeft + 64, yLeft);
                        leftSlopes.push(slopeLeft);
                        break;
                    case 'right':
                        let xRight = tile.pixelX/2;
                        let yRight = tile.pixelY/2;
                        const slopeRight = new Phaser.Geom.Line(xRight, yRight, xRight + 64, yRight + 64);
                        rightSlopes.push(slopeRight);
                    default:
                        break;
                }
            }

            //special tiles
           if(tile.properties.special) {
               chests.push([tile.pixelX/2, tile.pixelY/2-100]);
            }
         });
         
        //dangerous tiles
        dangerousTiles = getRange(coordinates);

        //lives
        let xHearts = 760;
        heartsImages = Object.values(hearts).map((heart) => {
            const heartImage = this.add.sprite(xHearts, 50, heart).setScale(0.25).setScrollFactor(0, 0);
            xHearts -= 38;
            return heartImage;
        });
        
        
        this.anims.create({
            key: 'disappear',
            frames: this.anims.generateFrameNumbers('heart', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: 10
        });
  
        //trees 
        collidedTiles.map(([x, y], i) => {
             if (i % 10 === 0 && y > 750) {
                 const tree = this.physics.add.sprite(x, y - 245, 'tree').setOrigin(0,0);
                 tree.body.allowGravity = false;
             }
         })

        //chest 
        this.anims.create({
            key: 'chest',
            frames: this.anims.generateFrameNumbers('chest', {start: 5, end: 0}),
            frameRate: 10,
            repeat: 0
        });

        const chestGroup = this.physics.add.group();
        chests.map(([x,y]) => {
            const chest = chestGroup.create(x, y, 'chest').setOrigin(0, 0).setScale(0.3, 0.3);
        });

        //player
        player = this.physics.add.sprite(100, 400, 'dude'); 
        player.setBounce(0.2);
       
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //open chest
        const chestOpen = (player, chest) => {
            chest.anims.play('chest', false);
            console.log(chest)
            
            potion = this.add.image(chest.x + 10, chest.y, 'potion0').setScale(0.2, 0.2).setOrigin(0, 0);
            this.physics.world.enable(potion);
            potion.body.setAllowGravity(false);
            this.physics.add.overlap(player, potion, takePotion, null, this)
        
            chest.setActive(false);
            this.physics.world.disable(chest);
            //console.log(potion)
        }

        //score
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '20px', fill: '#000' }).setScrollFactor(0, 0);

        //coins, grass
        this.anims.create({
            key: 'coin',
            frames: this.anims.generateFrameNumbers('coin', {start: 0, end: 14}),
            repeat: -1
        });

        coins = collidedTiles.map(([x, y], i) => {
        
                if(i % 3 === 0) {
                    const grass1 = this.add.image(x + 10, y - 3, 'grass1').setOrigin(0, 0).setScale(0.5, 0.5);
                    const coin = this.add.sprite(x + 30, y - 100, 'coin').setOrigin(0, 0).setScale(0.3, 0.3);
                    coin.anims.play('coin', true);
                    return coin;
                }
            })
    
        .filter((coin) => coin)
        
        .map((coin, i) => {
            this.physics.world.enable(coin, Phaser.Physics.Arcade.DYNAMIC_BODY);
            coin.body.allowGravity = false;
            this.physics.add.overlap(player, coin, collectCoins, null, this);
            });
   
        //cursors
        cursors = this.input.keyboard.createCursorKeys();

        //physic
        ground.setCollisionByProperty({ collides: true });
        this.physics.add.collider(player, ground);
        this.physics.add.collider(chestGroup, ground);
        this.physics.add.overlap(player, chestGroup, chestOpen, null, this);
        this.cameras.main.startFollow(player); 
    }


    update() 
    {
        let playerUp = false;
        let playerDown = false;
        player.body.allowGravity = true;

        leftSlopes.map((slope) => {
            if (Phaser.Geom.Intersects.LineToRectangle(slope, player.getBounds())) {
                playerUp = true;
            }
        
        });
        rightSlopes.map((slope) => {
            if (Phaser.Geom.Intersects.LineToRectangle(slope, player.getBounds())) {
                playerDown = true;
             };
        })
        

        //moves
        //move left
        if (cursors.left.isDown && player.x > 0)
        {   
            if (playerUp) {
                this.moveDiagonalLeft(player);
            } else if (playerDown) {
                this.moveDiagonalLeftUp(player)
            }
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }
        //move right
        else if (cursors.right.isDown && player.x < 9600)
        {
            if (playerUp) {
                this.moveDiagonalRight(player);
            } else if (playerDown) (
                this.moveDiagonalRightDown(player)
            )
            player.setVelocityX(160);
            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);
            if(playerUp || playerDown) {
                player.body.stop();
                player.body.allowGravity = false;
            }
            player.anims.play('turn');

        }
        //jump
        if (cursors.up.isDown && player.body.onFloor() || cursors.up.isDown && playerUp || cursors.up.isDown && playerDown)
        {
           // console.log(superPower.jump, Date.now())
            if(superPower.jump !== 0 && superPower.jump > Date.now()) {
                player.setVelocityY(-600);
            } else {
                player.setVelocityY(-450);
            }
        }

       if (getOverlap(player, dangerousTiles)) {
           if(gameOver) {
            this.gameOver();
            gameOver = false;
           }
       }
    }

//additional methods 

      //move diagonal
      moveDiagonalRight (player) {
          //player.body.allowGravity = false;
          player.setVelocityX(160);
          player.setVelocityY(-160);
      }
      moveDiagonalLeft (player) {
        //player.body.allowGravity = false;
        player.setVelocityX(-160);
        player.setVelocityY(160);
      }
      moveDiagonalRightDown (player) {
        player.setVelocityX(160);
        player.setVelocityY(160);
      }
      moveDiagonalLeftUp (player) {
        //player.body.allowGravity = false;
        player.setVelocityX(-160);
        player.setVelocityY(-160);
      }

      gameOver() {
          heartsImages[heartsIndex].anims.play('disappear', false);
          console.log(heartsImages);
          hearts[`${heartsIndex}`] = 'blackHeart';
          heartsIndex --;
        //stopMusic = true;
        this.time.delayedCall(500, function() {
            //this.sound.removeAll();
            this.cameras.main.fade(250);
        }, [], this);
        // restart game
        this.time.delayedCall(750, function() {
            this.scene.restart();
        }, [], this);
        return;
        }

}


