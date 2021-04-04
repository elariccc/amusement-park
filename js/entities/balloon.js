import settings from '../settings.js';
import imagesLoader from '../components/images-loader.js';
import Sprite from '../components/sprite.js';

export default class Balloon {
  constructor({ game, color, radius, x, y, yVelocity }) {
    this.game = game;
    this.context = game.canvasContext;
    this.color = color;
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = yVelocity;
    this.done = false;

    const img = imagesLoader.get(`img/balloon-${this.color}.png`);
    const frames = 10;

    this.sprite = new Sprite(
      img,
      frames,
      1000
    );

    this.imgWidth = this.radius * 150 / 50;
    this.imgHeight = img.height * this.imgWidth / (img.width / frames);
  }

  update(delta) {
    this.x = Math.min( settings.width - this.radius, Math.max(this.radius, this.x + this.xVelocity * delta) );
    this.y += this.yVelocity * delta;

    this.xVelocity = (
      this.game.wind > 0 ?
        ( (1 - (this.x / settings.width)) ** 2 * this.game.wind )
      :
        ( (this.x / settings.width) ** 2 * this.game.wind )
    );

    if (this.y > (settings.height + this.imgHeight)) this.done = true;

    this.sprite.update(delta);
  }

  render() {
    this.context.save();
    
    this.context.translate(this.x, settings.height - this.y);

    this.angle = 60 / 180 * Math.PI * this.xVelocity / settings.windMax;
    this.context.rotate(this.angle);

    this.context.drawImage(...this.sprite.getSpriteData(), - this.imgWidth / 2, - this.imgWidth / 2, this.imgWidth, this.imgHeight)

    this.context.restore();
  }
}

