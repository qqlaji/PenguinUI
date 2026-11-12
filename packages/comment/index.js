import tComment from './index.vue';
tComment.install = (app) => {
  app.component(tComment.name, tComment);
};
export default tComment;
