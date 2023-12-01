import Phaser from 'phaser';
import { getRange, getOverlap, isClose, getSlopes } from '../utils/auxiliary';
import Enviroment from '../classes/nature/Enviroment';
import Sky from '../classes/nature/Sky';
import Clouds from '../classes/nature/Clouds';
import Mountains from '../classes/nature/Mountains';
import Hills from '../classes/nature/Hills';
import Lives from '../classes/Lives';
import Chests from '../classes/Chests';
import Enemies from '../classes/Enemies';
import Coins from '../classes/Coins';
import Checkpoints from '../classes/Checkpoints';
//import { superPower } from '../classes/Stars';
// import { select } from '../utils/levels';
import { heartsIndex } from '../utils/variables';
import Player from '../classes/Player';
import Sounds from '../classes/Sounds';
import ButtonControl from '../classes/ButtonControl';

//variables
let playerUp = false;
let playerDown = false;
let player, cursors, checkpoints, playerObj;
let dangerousTiles;
let sound, chests, coins;
let stopMusic = false;
let speed = 300;

let gameOverFlag;

let leftSlopes = [];
let rightSlopes = [];

let score = 0,
  scoreText;

let playerX = 200;

function collectCoins(player, coin) {
  coin.destroy();
  score += 10;
  scoreText.setText('score:' + score);
  coins.coinsSound.play();
}
function setPlayerX(player, checkpoint) {
  if (player.x !== 200) playerX = checkpoint.x;
}

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'game-scene' });
  }
  init(data) {
    this.level = data.level || 1;
    if (data.playerX) playerX = data.playerX;
  }
  preload() {
    //controls
    this.controls = new ButtonControl(this);
    this.controls.preloadControl();
    //sound
    sound = new Sounds(this);
    sound.preloadSound();

    chests = new Chests(this);
    chests.preloadChests();

    coins = new Coins(this);
    coins.preloadCoins();

    //sky
    this.load.image('sky', 'assets/images/Sky.png');
    //cloud
    this.load.image('cloud', 'assets/images/Cloud_1.png');
    this.load.image('cloud2', 'assets/images/Cloud_2.png');
    //player
    this.load.spritesheet('dude', 'assets/images/fox.png', {
      frameWidth: 216,
      frameHeight: 185,
    });
    //hills
    this.load.image('hill', 'assets/images/Hills_1.png');
    this.load.image('hill2', 'assets/images/Hills_2.png');
    //mountain
    for (let i = 0; i < 4; i++) {
      this.load.image(`mountain${i}`, `assets/images/Mountain_${i + 1}.png`);
    }
    //heart
    this.load.spritesheet('heart', 'assets/images/hearts.png', {
      frameWidth: 30,
      frameHeight: 26,
    });
    this.load.image('blackHeart', 'assets/images/blackHeart.png');

    //environment
    this.load.image('tree', 'assets/images/environment/tree.png');
    this.load.image('grass1', 'assets/images/environment/grass1.png');

    //enemy
    this.load.image('enemy', 'assets/images/enemy.png');

    //checkpoint

    this.load.image('checkpoint', 'assets/images/checkpoint.png');

    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON(`level_${this.level}`, `assets/level_${this.level}.json`);
    // this.load.tilemapTiledJSON(`choose_level`, `level_1.json`);
    // tiles in spritesheet
    // this.load.image('tiles', 'assets/tiles.png');
    this.load.image('dirt', 'assets/tiles/dirt.png');
    this.load.image('grass', 'assets/tiles/grass.png');
    this.load.image('grassCliff', 'assets/tiles/grassCliff.png');
    this.load.image('hills', 'assets/tiles/hills.png');
    this.load.image('water', 'assets/tiles/water.png');
    this.load.image('special', 'assets/tiles/special.png');

    //plugin for animation
    this.load.scenePlugin(
      'AnimatedTiles',
      'https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js',
      'animatedTiles',
      'animatedTiles'
    );
  }

  create() {
    const style = { fontFamily: 'Baloo_2', fontSize: '2rem', color: '#38a5c6', align: 'center' };

    gameOverFlag = true;

    //sound
    sound.createSound();
    sound.playBackground();

    //level size
    this.cameras.main.setBounds(0, 0, 9600, 1024);

    //sky
    new Sky(this, 5, 1920);

    //clouds
    new Clouds(this, 'cloud', 0, 100);
    new Clouds(this, 'cloud2', 350, 300);
    new Clouds(this, 'cloud', 200, 500);

    //mountains
    new Mountains(this, 0, 300);
    new Hills(this, 0, 0, 'hill', 6);
    //map and tileset
    const map = this.make.tilemap({ key: `level_${this.level}` });
    // const map = this.make.tilemap({ key: 'choose_level' });

    const dirtSet = map.addTilesetImage('dirt', 'dirt');
    const hillsSet = map.addTilesetImage('hills', 'hills');
    const grassSet = map.addTilesetImage('grass', 'grass');
    const waterSet = map.addTilesetImage('water', 'water');
    const grassCliffSet = map.addTilesetImage('grassCliff', 'grassCliff');
    const specialSet = map.addTilesetImage('special', 'special');

    const ground = map.createLayer(
      'ground',
      [dirtSet, hillsSet, grassSet, waterSet, grassCliffSet, specialSet],
      0,
      0
    );
    //const ground = map.createLayer('ground', [dirtSet, grassSet, grassCliffSet], 0, 0);
    this.animatedTiles.init(map);

    //tileMap
    let coordinates = [];
    let collidedTiles = [];
    this.graphics = this.add.graphics({ lineStyle: { width: 0, color: 0xaa00aa } });
    this.dangerousTiles = map.filterTiles((tile) => tile.properties.dangerous);
    console.log(this.dangerousTiles);
    ground.forEachTile((tile) => {
      //collided tiles
      if (tile.properties.collides) {
        collidedTiles.push([tile.pixelX, tile.pixelY]);
      }

      //dangerous tiles
      else if (tile.properties.dangerous) {
        coordinates.push([tile.pixelX, tile.pixelY]);
      }

      //slopes
      else if (tile.properties.hill) {
        let xLeft, yLeft, slopeLeft, xRight, yRight, slopeRight;
        switch (tile.properties.hill) {
          case 'left':
            xLeft = tile.pixelX; //проверить
            yLeft = tile.pixelY + 128;
            slopeLeft = new Phaser.Geom.Line(xLeft, yLeft, xLeft + 128, yLeft - 128);
            leftSlopes.push(slopeLeft);
            break;
          case 'right':
            xRight = tile.pixelX;
            yRight = tile.pixelY;
            slopeRight = new Phaser.Geom.Line(xRight, yRight, xRight + 128, yRight + 128);
            rightSlopes.push(slopeRight);
          // this.graphics.strokeLineShape(slopeRight);
        }
      }
      //special tiles
      if (tile.properties.special) {
        chests.getCoordinates([tile.pixelX, tile.pixelY - 100]);
      }
    });

    leftSlopes.sort((a, b) => a.x1 - b.x1);
    this.leftSlopes = getSlopes(leftSlopes);

    // this.leftSlopes.forEach((slopeLeft) => {
    //   this.graphics.strokeLineShape(slopeLeft);
    //   this.graphics.strokeLineShape(new Phaser.Geom.Line(slopeLeft));
    // })
    rightSlopes.sort((a, b) => a.x1 - b.x1);
    this.rightSlopes = getSlopes(rightSlopes);

    // this.rightSlopes.forEach((slopeRight) => {
    //   this.graphics.strokeLineShape(slopeRight);
    //   this.graphics.strokeLineShape(new Phaser.Geom.Line(slopeRight));
    // });
    //dangerous tiles
    dangerousTiles = getRange(coordinates);
    //debug
    // dangerousTiles.forEach((inner) => {
    //   const line = new Phaser.Geom.Line(inner[0], 800, inner[inner.length - 1], 800);
    //   this.graphics.strokeLineShape(line);
    // });
    //enviroment
    this.enviroment = new Enviroment(this, collidedTiles);
    //chests
    this.chestGroup = chests.createGroup();
    //player
    playerObj = new Player(this, playerX, 400, 'dude');
    player = playerObj.player;
    //checkpoints
    if (map.getObjectLayer('checkpoints')) {
      const checkpointsLayer = map.getObjectLayer('checkpoints');
      checkpoints = new Checkpoints(this);
      checkpointsLayer.objects.forEach((checkpoint) =>
        checkpoints.getCoordinates([checkpoint.x, checkpoint.y])
      );
      checkpoints.createGroup(this, player, setPlayerX);
    }

    coins.createCoins();
    coins.addCoins(collidedTiles, this, player, collectCoins);

    //cursors
    cursors = this.input.keyboard.createCursorKeys();

    //lives
    this.lives = new Lives(this);

    //enemies
    if (map.getObjectLayer('enemies')) {
      const enemiesLayer = map.getObjectLayer('enemies');
      this.enemies = new Enemies(this);
      enemiesLayer.objects.forEach((enemy) => this.enemies.getCoordinates([enemy.x, enemy.y]));
      this.enemies.createGroup(this, player, () => {
        sound.playHit();
        this.gameOver();
      });
    }

    //score
    scoreText = this.add.text(16, 16, `score: ${score}`, style).setScrollFactor(0, 0);

    //physic
    ground.setCollisionByProperty({ collides: true });
    this.physics.add.collider(player, ground);
    this.physics.add.collider(this.chestGroup, ground);
    this.physics.add.collider(checkpoints.checkpointsGroup, ground);
    this.physics.add.overlap(
      player,
      this.chestGroup,
      chests.chestOpen,
      null
      //this
    );
    this.cameras.main.startFollow(player);

    player.setBodySize(80, 170);

    this.slopeCurrent;

    this.intersection = [];

    //controls
    this.controls.createControl();
    console.log(this.controls);
  }
  update() {
    player.body.allowGravity = true;
    if (player.body.onFloor()) playerObj.isFalling = false;
    if (player.y < 20) player.setVelocityY(450);

    //движение на склонах
    this.slopeCurrent = this.leftSlopes.filter((slope) =>
      Phaser.Geom.Intersects.LineToRectangle(slope, player.getBounds())
    );
    if (this.slopeCurrent.length) {
      const point = this.slopeCurrent[0].x1;
      const end = this.slopeCurrent[0].x2;
      if (player.x + 17 > point && player.x - 58 < end) {
        playerUp = true;
      } else if (player.x + 17 < point || player.x - 58 > end) {
        playerUp = false;
      }
    } else if (!this.slopeCurrent.length) {
      playerUp = false;
    }
    if (playerObj.isJumping) {
      playerUp = false;
    }
    this.slopeCurrentRight = this.rightSlopes.filter((slope) =>
      Phaser.Geom.Intersects.LineToRectangle(slope, player.getBounds())
    );
    if (this.slopeCurrentRight.length) {
      const point = this.slopeCurrentRight[0].x1;
      const end = this.slopeCurrentRight[0].x2;
      if (player.x > point && player.x - 20 < end) {
        playerDown = true;
      } else if (player.x < point || player.x - 20 > end) {
        playerDown = false;
      }
    } else if (!this.slopeCurrentRight.length) {
      playerDown = false;
    }
    if (playerObj.isJumping) {
      playerDown = false;
    }
    //прыжки на склонах
    if (playerObj.isFalling && (playerUp || playerDown)) {
      if (!(cursors.up.isDown || this.controls.upFlag)) {
        const line = this.slopeCurrent[0];
        const line2 = this.slopeCurrentRight[0];
        let intersection;
        if (line) {
          intersection = Phaser.Geom.Intersects.GetLineToRectangle(line, player.getBounds())[0].y;
        } else if (line2) {
          intersection = Phaser.Geom.Intersects.GetLineToRectangle(line2, player.getBounds())[0].y;
        }
        if (!(cursors.up.isDown || this.controls.upFlag)) {
          if (line) {
            player.y = intersection;
            if (player.y - 10 < line.y2) player.y = line.y2 - 40;
          } else if (line2) {
            player.y = intersection - 20;
            if (player.y - 10 < line2.y1) player.y = line2.y1 - 40;
          }
        }
        playerObj.isFalling = false;
      }
    }
    //moves
    playerObj.move(cursors, this.controls, playerUp, playerDown, speed);
    //jump
    if ((cursors.up.isDown || this.controls.upFlag) && player.body.onFloor()) {
      player.setVelocityY(-450);
    }
    playerObj.jump(cursors, this.controls, playerUp, playerDown);
    //dangerous
    this.physics.world.overlapTiles(
      player,
      this.dangerousTiles,
      () => {
        if (gameOverFlag) {
          sound.playGurgle();
          this.gameOver();
        }
      },
      null,
      this
    );
    sound.playRiver(isClose(player, dangerousTiles));
    //sound
    sound.updateSound(
      cursors,
      player,
      playerUp,
      playerDown,
      this.slopeCurrent,
      playerObj.isJumping
    );
    //sound.updateRunOnSlopes(cursors, playerUp, playerDown);
    if (player.y > 1024) {
      this.gameOver();
    }
    this.controls.updateControl();
  }

  gameOver() {
    if (!gameOverFlag) return;
    console.log('game over');
    leftSlopes = [];
    rightSlopes = [];
    this.lives.lose(heartsIndex.value);
    heartsIndex.value--;
    stopMusic = true;
    if (heartsIndex.value < 0) {
      this.time.delayedCall(
        500,
        function () {
          this.sound.removeAll();
          this.cameras.main.fade(250);
          this.scene.pause();
          this.scene.launch('game-over');
        },
        [],
        this
      );
    }
    // restart game
    this.time.delayedCall(
      100,
      function () {
        this.cameras.main.fadeIn(250);
        player.x = playerX;
        player.y = 400;
        gameOverFlag = true;
        //this.cameras.main.fadeOut(250);
        //this.scene.restart();
      },
      [],
      this
    );
    gameOverFlag = false;
    return;
  }
}
