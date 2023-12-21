import { heartsIndex } from './hearts';
import results from './results';
export default (scene) => {
  heartsIndex.value = 2;
  results.score = 0;
  results.stars = 0;
  for (let num in heartsIndex.hearts) {
    heartsIndex.hearts[num] = 'heart';
  }
  scene.start('game-scene');
  scene.stop();
};
