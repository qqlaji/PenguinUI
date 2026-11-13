import tAudioPlayer from './index.vue';

tAudioPlayer.install = (app) => {
  app.component(tAudioPlayer.name, tAudioPlayer);
};

export default tAudioPlayer;
