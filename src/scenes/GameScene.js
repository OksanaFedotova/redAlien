import Phaser from "phaser";
import {
  getRange,
  getOverlap,
} from "../functions/auxiliary";
import Enviroment from "../classes/nature/Enviroment";
import Sky from "../classes/nature/Sky";
import Clouds from "../classes/nature/Clouds";
import Mountains from "../classes/nature/Mountains";
import Hills from "../classes/nature/Hills";
import Lives from "../classes/Lives";
import Chests from "../classes/Chests";
import Enemies from "../classes/Enemies";
import Coins from "../classes/Coins";
import Checkpoints from "../classes/Checkpoints";
import  { superPower } from '../classes/Potion';
import { level } from "../levels";
import { select } from "../levels";

//variables
let player, cursors;
let dangerousTiles;

let speed = 160;

let gameOverFlag;
let heartsIndex = 2;

const leftSlopes = [];
const rightSlopes = [];
let score, scoreText;
score = 0;

function collectCoins(player, coin) {
  coin.destroy();
  score += 10;
  scoreText.setText("score:" + score);
}

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  preload() {
    //sky
    this.load.image("sky", "assets/images/Sky.png");
    //cloud
    this.load.image("cloud", "assets/images/Cloud_1.png");
    this.load.image("cloud2", "assets/images/Cloud_2.png");
    //player
    this.load.spritesheet("dude", "assets/images/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    //hills
    this.load.image("hill", "assets/images/Hills_1.png");
    this.load.image("hill2", "assets/images/Hills_2.png");
    //mountain
    for (let i = 0; i < 4; i++) {
      this.load.image(`mountain${i}`, `assets/images/Mountain_${i + 1}.png`);
    }
    //hill left
    this.load.image("hillLeft", "assets/images/GrassHillLeft.png");

    //heart
    this.load.spritesheet("heart", "assets/images/hearts.png", {
      frameWidth: 30,
      frameHeight: 26,
    });
    this.load.image("blackHeart", "assets/images/blackHeart.png");

    //environment
    this.load.image("tree", "assets/images/environment/tree.png");
    this.load.image("grass1", "assets/images/environment/grass1.png");

    //coins
    this.load.spritesheet("coin", "assets/images/coin.png", {
      frameWidth: 67,
      frameHeight: 66,
    });

    //chest
    this.load.spritesheet("chest", "assets/images/chest.png", {
      frameWidth: 39.6,
      frameHeight: 46.8,
    });

    //potions
    for (let i = 0; i < 4; i++) {
      this.load.image(`potion${i}`, `assets/images/potions/potion${i}.png`);
    }

    //enemy
    this.load.image("enemy", "assets/images/enemy.png");

    //checkpoint

    this.load.image("checkpoint", "assets/images/checkpoint.png")

    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON(`level_${level.value}`, `assets/level_${level.value}.json`);
    // tiles in spritesheet
    this.load.image("tiles", "assets/tiles.png");

    //plugin for animation
    this.load.scenePlugin(
      "AnimatedTiles",
      "https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js",
      "animatedTiles",
      "animatedTiles"
    );
  }

  create() {
    gameOverFlag = true;

    //level size
    this.cameras.main.setBounds(0, 0, 9600, 1024);

    //sky
    new Sky(this, 5, 1920);

    //clouds
    new Clouds(this, "cloud", 0, 100);
    new Clouds(this, "cloud2", 350, 300);
    new Clouds(this, "cloud", 200, 500);

    //mountains
    const mountains = new Mountains(this, 0, 600);

    //chests
    const chests = new Chests(this);
    const hills = new Hills(this, 0, 500, "hill", 11);
    //map and tileset
    const map = this.make.tilemap({ key: `level_${level.value}` });
    const tileSet = map.addTilesetImage("tiles", "tiles");
    const ground = map.createLayer("ground", tileSet, 0, 0);
    this.animatedTiles.init(map);

    //tileMap
    let coordinates = [];
    let collidedTiles = [];

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
      //var graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } })
        switch (tile.properties.hill) {
          case "left":
            let xLeft = tile.pixelX;
            let yLeft = tile.pixelY + 64;
            const slopeLeft = new Phaser.Geom.Line(
              xLeft,
              yLeft,
              xLeft + 64,
              yLeft - 64
            );
            leftSlopes.push(slopeLeft);
          //  graphics.strokeLineShape(slopeLeft);
            break;
          case "right":
            let xRight = tile.pixelX;
            let yRight = tile.pixelY - 64;
            const slopeRight = new Phaser.Geom.Line(
              xRight,
              yRight,
              xRight + 64,
              yRight + 64
            );
            rightSlopes.push(slopeRight);
           // graphics.strokeLineShape(slopeRight);
          default:
            break;
        }
      }
      //special tiles
      if (tile.properties.special) {
        chests.getCoordinates([tile.pixelX, tile.pixelY - 100])
      }
    });

    //dangerous tiles
    dangerousTiles = getRange(coordinates);
    //enviroment
    this.enviroment = new Enviroment(this, collidedTiles);
    //chests
    this.chestGroup = chests.createGroup();

    //checkpoints
    // const checkpointsLayer = map.getObjectLayer("checkpoints");
    // this.checkpoints = new Checkpoints(this);
    // checkpointsLayer.objects.forEach((checkpoint) => this.checkpoints.getCoordinates([checkpoint.x, checkpoint.y]));
    // this.checkpoints.createGroup(this, player, (player, checkpoint) => console.log(checkpoint));
    // const playerCoordinates = this.checkpoints.coordinates;
    // console.log(this.checkpoints)

    //player
    player = this.physics.add.sprite(100, 400, "dude");
    player.setBounce(0.2);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    })

    //coins
    const coins = new Coins(this);
    coins.addCoins(collidedTiles, this, player, collectCoins);

    //cursors
    cursors = this.input.keyboard.createCursorKeys();
    
    //lives
    this.lives = new Lives(this);

    // //enemies 
    // const enemiesLayer = map.getObjectLayer("enemies");
    // this.enemies = new Enemies(this);
    // enemiesLayer.objects.forEach((enemy) => this.enemies.getCoordinates([enemy.x, enemy.y]));
    // this.enemies.createGroup(this, player, () => this.gameOver());

    //score
    scoreText = this.add
      .text(16, 16, "score: 0", { fontSize: "20px", fill: "#000" })
      .setScrollFactor(0, 0);

    //physic
    ground.setCollisionByProperty({ collides: true });
    this.physics.add.collider(player, ground);
    this.physics.add.collider(this.chestGroup, ground);
    // this.physics.add.collider(this.checkpoints.checkpointsGroup, ground);
    this.physics.add.overlap(player, this.chestGroup, chests.chestOpen, null, this);
    this.cameras.main.startFollow(player);

    select.addEventListener('change',  (e) => {
      level.value = e.target.value;
      this.gameOver();
    });
    document.body.append(select);
  }

  update() {
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
      }
    });

    //moves
    if(superPower && Object.keys(superPower)[0] == 'run') {
     // console.log(Object.keys(superPower)[0])
      speed = 200;
    }
    //move left
    if (cursors.left.isDown && player.x > 0) {
      if (playerUp) {
        this.moveDiagonalLeft(player);
      } else if (playerDown) {
        this.moveDiagonalLeftUp(player);
      }
      player.setVelocityX(-speed);
      player.anims.play("left", true);
    }
    //move right
    else if (cursors.right.isDown && player.x < 9600) {
      if (playerUp) {
        this.moveDiagonalRight(player);
      } else if (playerDown) this.moveDiagonalRightDown(player);
      player.setVelocityX(speed);
      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);
      if (playerUp || playerDown) {
        player.body.stop();
        player.body.allowGravity = false;
      }
      player.anims.play("turn");
    }
    //jump
    if (
      (cursors.up.isDown && player.body.onFloor()) ||
      (cursors.up.isDown && playerUp) ||
      (cursors.up.isDown && playerDown)
    ) {
     // console.log(superPower)
        if(superPower && Object.keys(superPower)[0] == 'jump') {
      //    console.log(Object.keys(superPower)[0])
          player.setVelocityY(-600);
      } else {
        player.setVelocityY(-450);
     }
    }
    if (getOverlap(player, dangerousTiles)) {
      if (gameOverFlag) {
        this.gameOver();
        //gameOverFlag = false;
      }
    }
  }

  //additional methods

  //move diagonal
  moveDiagonalRight(player) {
    player.setVelocityX(speed);
    player.setVelocityY(-speed);
  }
  moveDiagonalLeft(player) {
    player.setVelocityX(-speed);
    player.setVelocityY(speed);
  }
  moveDiagonalRightDown(player) {
    player.setVelocityX(speed);
    player.setVelocityY(speed);
  }
  moveDiagonalLeftUp(player) {
    player.setVelocityX(-speed);
    player.setVelocityY(-speed);
  }
  gameOver() {
    if (!gameOverFlag) return;
    this.lives.lose(heartsIndex);
    heartsIndex--;
    //stopMusic = true;
    this.time.delayedCall(
      500,
      function () {
        //this.sound.removeAll();
        this.cameras.main.fade(250);
      },
      [],
      this
    );
    // restart game
    this.time.delayedCall(
      750,
      function () {
        this.scene.restart();
      },
      [],
      this
    );
    gameOverFlag = false;
    return;
  }
}
