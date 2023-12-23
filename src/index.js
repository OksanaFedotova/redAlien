import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import GameOver from './scenes/GameOver';
import LevelSelect from './scenes/LevelSelect';
import LevelCompleted from './scenes/LevelCompleted';
import Menu from './scenes/Menu';
//import { level } from './levels';
//const iframe = document.getElementsByTagName('iframe');
const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 500,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: [LevelSelect, GameScene, LevelCompleted, GameOver, Menu],
};

export default new Phaser.Game(config);
