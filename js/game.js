import settings from './settings.js';
import imagesLoader from './components/images-loader.js';
import soundsLoader from './components/sounds-loader.js';

import Balloon from './entities/balloon.js';
import BalloonPop from './entities/balloon-pop.js';
import Knife from './entities/knife.js';

import { results, stats, timer } from './index.js';

export default class Game {
  constructor(canvasId) {
    const canvasElement = document.querySelector(`#${canvasId}`);
    canvasElement.setAttribute('width', settings.width);
    canvasElement.setAttribute('height', settings.height);

    this.canvasContext = canvasElement.getContext('2d');

    this.music = soundsLoader.get('audio/music.mp3');
    this.music.loop = true;
    this.music.volume = 0;
  }

  render() {
    this.canvasContext.drawImage(imagesLoader.get('img/canvas-background.png'), 0, 0);

    this.balloonPops.forEach(balloonPop => balloonPop.render());
    this.balloons.forEach(balloon => balloon.render());

    this.knife.render();

    timer.innerHTML = Math.max( Math.ceil( (settings.gameDuration - this.timePassed) / 1000 ), 0 );
  }

  start() {
    this.timeStart = performance.now();
    this.timeCurrent = this.timeStart;
    this.wind = 0;
    this.windTarget = 0;
    this.balloons = [];
    this.balloonPops = [];
    this.balloonsPoped = 0;
    this.balloonsTotal = 0;
    this.difficulty = 1;
    this.knife = new Knife(this);

    this.fadeInMusic(settings.musicVolume);

    timer.innerHTML = Math.ceil(settings.gameDuration / 1000);

    //Frame effects
    const step = () => {
      this.timePrevious = this.timeCurrent;
      this.timeCurrent = performance.now();
      this.timeDelta = this.timeCurrent - this.timePrevious;
      this.timePassed = this.timeCurrent - this.timeStart;
      this.difficulty = 1 + (settings.maxDifficulty - 1) * (this.timePassed / settings.gameDuration) ** 1.5;
      
      this.wind = this.wind + 0.005 * (this.windTarget - this.wind);
      
      //Balloons update and deletion
      for (let i = 0; i < this.balloons.length; i++) {
        this.balloons[i].update(this.timeDelta);

        //Collision with knife check
        if (
          this.balloons[i].y + this.balloons[i].radius >= (settings.height - this.knife.imgHeight) &&
          this.balloons[i].y <= (settings.height - this.knife.imgHeight) &&
          (this.knife.x - this.balloons[i].x) ** 2 + (settings.height - this.knife.imgHeight - this.balloons[i].y) ** 2 <= this.balloons[i].radius ** 2
        ) {
          this.balloons[i].done = true;
          this.balloonsPoped++;

          //Spawn balloon pop
          this.balloonPops.push(new BalloonPop({
            game: this,
            color: this.balloons[i].color,
            radius: this.balloons[i].radius,
            x: this.balloons[i].x,
            y: this.balloons[i].y,
            angle: this.balloons[i].angle,
          }));
        }

        if (this.balloons[i].done) {
          this.balloons.splice(i, 1);
          i--;
        }
      }

      //Balloon pops update and deletion
      for (let i = 0; i < this.balloonPops.length; i++) {
        this.balloonPops[i].update(this.timeDelta);

        if (this.balloonPops[i].done) {
          this.balloonPops.splice(i, 1);
          i--;
        }
      }

      this.knife.update();

      this.render();

      if (this.timePassed > settings.gameDuration && this.balloons.length === 0 && this.balloonPops.length === 0) {
        this.end();
        return null;
      }

      window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);

    //Spawn balloons randomly
    const spawn = () => {
      this.balloonsTotal++;

      const radius = 25 + Math.random() * 25;
      const color = settings.colors[Math.floor(Math.random() * settings.colors.length)];

      this.balloons.push(new Balloon({
        game: this,
        color: color,
        radius: radius,
        x: radius + Math.random() * (settings.width - 2 * radius),
        y: - radius,
        yVelocity: settings.initialYvelocity * this.difficulty,
      }));

      if (this.timePassed > settings.gameDuration) return null;

      this.spawnInterval = setTimeout(spawn, (0.1 + Math.random()) * settings.spawnInterval / this.difficulty ** 1.5);
    }

    setTimeout(spawn);

    //Set wind randomly
    const changeWind = () => {
      this.windTarget = settings.windMax * (-1 + 2 * Math.random());
      
      if (this.timePassed > settings.gameDuration) return null;

      this.spawnInterval = setTimeout(changeWind, (0.1 + Math.random()) * settings.windInterval);
    }

    setTimeout(changeWind);
  }

  end() {
    results.classList.add('results--in');
    stats.innerHTML = `You've poped ${this.balloonsPoped} of ${this.balloonsTotal} balloons!`;
    this.fadeOutMusic();
  }

  fadeInMusic (target) {
    clearInterval(this.fadeOutMusicInterval);

    this.music.play();
  
    const increaseVolume = () => {
      this.music.volume = Math.min( (this.music.volume + 0.01), target );
      
      if (this.music.volume < target) this.fadeInMusicInterval = setTimeout(increaseVolume, 50);
    };
  
    increaseVolume();
  }
  
  fadeOutMusic () {
    clearInterval(this.fadeOutMusicInterval);

    const decreaseVolume = () => {
      this.music.volume = Math.max( (this.music.volume - 0.01), 0);
      
      if (this.music.volume > 0) this.fadeOutMusicInterval = setTimeout(decreaseVolume, 50);
      else this.music.pause();
    };
  
    decreaseVolume();
  }
}
