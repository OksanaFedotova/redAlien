export default (scene) => {
  scene.start('level-select');
  scene.stop('game-scene');
  scene.stop('menu');
  //this.scene.setVisible(false, 'menu');
}