/* eslint-disable no-new */
import Phaser from 'phaser';
import bridge from '@vkontakte/vk-bridge';
import style from '../utils/style';
import SimpleButton from '../classes/SimpleButton';
import AnimatedButton from '../classes/AnimatedButton';
import data from '../utils/data';

let stopSound = false;

export default class Menu extends Phaser.Scene {
  constructor() {
    super('menu');
    this.styleText = { ...style, color: '#6CD3F0' };
  }

  preload() {
    this.load.image('close', 'assets/images/close.png');
    this.load.audio('theme', 'assets/audio/theme.mp3');
    this.load.spritesheet('sound', 'assets/images/sound.png', {
      frameWidth: 256,
      frameHeight: 256,
    });
    this.load.image('share', 'assets/images/share.png');
    this.screenWidth = this.cameras.main.width;
    this.screenHeight = this.cameras.main.height;
  }

  create() {
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0.8)');
    const resume = () => {
      this.scene.resume('game-scene');
      this.scene.pause();
      this.scene.setVisible(false, 'menu');
    };
    new SimpleButton(
      this.screenWidth - 60,
      60,
      null,
      this.styleText,
      this,
      resume,
      'close',
      0.15,
      35
    );

    // all sounds

    const soundPause = () => {
      data.stopSound = true;
      this.game.sound.stopAll();
      return true;
    };
    const soundResume = () => {
      data.stopSound = false;
      return false;
    };
    this.soundsButton = new AnimatedButton(
      { x: this.screenWidth * 0.47, y: this.screenHeight * 0.4 },
      'sound',
      { label: 'выключить звук', style: this.styleText },
      this,
      { callback1: soundPause, callback2: soundResume, flag: stopSound }
    );

    // share
    const share = () => {
      bridge.send('VKWebAppShowInviteBox');
      // .then((data) => {
      //   if (data.success) {
      //     console.log('success', data.success);
      //   }
      // })
      // .catch((e) => {
      //   const { error_code: errorCode, error_reason: errorReason } = e.error_data;
      //   if (errorCode === 4) {
      //     console.log(errorReason);
      //   }
      // });
    };
    this.shareButton = new SimpleButton(
      this.screenWidth * 0.47,
      this.screenHeight * 0.6,
      'поделиться',
      this.styleText,
      this,
      share,
      'share',
      0.1,
      35
    );
  }
}
