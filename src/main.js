import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import Pause from './scenes/Pause';
import GameOver from './scenes/GameOver';
import bridge from '@vkontakte/vk-bridge';

bridge.send('VKWebAppInit', {});
bridge.send("VKWebAppShare", {"link": "https://vk.com/app6909581#hello"});
bridge.send("VKWebAppAllowNotifications"); 

// чтобы ловить события в консоль:
bridge.subscribe((e) => {
  console.log('bridge event', e);
});


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
