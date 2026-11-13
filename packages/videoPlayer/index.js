import tVideoPlayer from './index.vue';

tVideoPlayer.install = (app) => {
  app.component(tVideoPlayer.name, tVideoPlayer);
};

export default tVideoPlayer;
