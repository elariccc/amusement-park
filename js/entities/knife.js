import settings from '../settings.js';
import imagesLoader from '../components/images-loader.js';
import Sprite from '../components/sprite.js';

export default class Knife {
  constructor(game) {
    this.game = game;
    this.context = game.canvasContext;
    this.x = game.mouseX;
    this.y = settings.height;

    const img = imagesLoader.get('img/knife.png');

    this.sprite = new Sprite(img);

    this.imgWidth = img.width;
    this.imgHeight = img.height;
  }

  update(delta) {
    this.x = Math.min( settings.width, Math.max(0, this.x + 0.05 * (this.game.mouseX - this.x)) );
    this.sprite.update(delta);
  }

  render() {
    this.context.save();
    
    this.context.translate(this.x, 0);

    this.context.drawImage(...this.sprite.getSpriteData(), - this.imgWidth / 2, 0, this.imgWidth, this.imgHeight)

    this.context.restore();
  }
}