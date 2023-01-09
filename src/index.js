import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import { level } from "./levels";

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: [GameScene],
};

export default new Phaser.Game(config);
