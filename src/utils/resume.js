import data from './data';
import { heartsIndex } from './hearts';
import results from './results';

export default (scene) => {
  heartsIndex.value = 2;
  results[data.level - 1].score = 0;
  results[data.level - 1].stars = 0;
  for (let num in heartsIndex.hearts) {
    heartsIndex.hearts[num] = 'heart';
  }
  scene.start('game-scene');
  scene.stop();
};
