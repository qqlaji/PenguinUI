import tQrcode from './index.vue';
tQrcode.install = (app) => {
  app.component(tQrcode.name, tQrcode);
};
export default tQrcode;
