import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import Pause from './scenes/Pause';
import GameOver from './scenes/GameOver';
import bridge from '@vkontakte/vk-bridge';

bridge.send('VKWebAppInit', {});
//bridge.send("VKWebAppShare", {"link": "https://vk.com/app7995655_48927#hello"});
//bridge.send("VKWebAppAllowNotifications"); 


const config = {
	type: Phaser.AUTO,
	width: 1000,
	height: 4050,
	physics: {
		default: 'arcade',
		arcade: {
		gravity: { y: 0 }
	}
	},
	scene: [GameScene, Pause, GameOver]
}

export default new Phaser.Game(config)
