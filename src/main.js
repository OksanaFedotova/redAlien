import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import Pause from './scenes/Pause';
import GameOver from './scenes/GameOver'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
		gravity: { y: 0 }
	}
	},
	scene: [GameScene, Pause, GameOver]
}

export default new Phaser.Game(config)
