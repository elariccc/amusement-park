import settings from '../settings.js'
import imagesLoader from '../components/images-loader.js';
import soundsLoader from '../components/sounds-loader.js';
import Sprite from '../components/sprite.js';

export default class BalloonPop {
  constructor({ game, color, radius, x, y, angle }) {
    this.context = game.canvasContext;
    this.color = color;
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.done = false;
    this.lifeDuration = 350;
    this.lifeCurrent = 0;

    soundsLoader.get('audio/balloon-pop.wav').play();

    const img = imagesLoader.get(`img/balloon-${this.color}-pop.png`);
    const frames = 7;

    this.sprite = new Sprite(
      img,
      frames,
      this.lifeDuration
    );

    this.imgWidth = this.radius * 150 / 50;
    this.imgHeight = img.height * this.imgWidth / (img.width / frames);
  }

  update(delta) {
    this.lifeCurrent += delta;
    if (this.lifeCurrent >= this.lifeDuration) this.done = true;

    this.sprite.update(delta);
  }

  render() {
    this.context.save();
    
    this.context.translate(this.x, settings.height - this.y);

    this.context.rotate(this.angle);

    this.context.drawImage(...this.sprite.getSpriteData(), - this.imgWidth / 2, - this.imgWidth / 2, this.imgWidth, this.imgHeight)

    this.context.restore();
  }
}

