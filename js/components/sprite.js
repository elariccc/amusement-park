export default class Sprite {
  constructor(img, frames = 1, animationDuration = 1) {
    this.img = img;
    this.frames = frames;
    this.animationDuration = animationDuration;

    this.frameWidth = img.naturalWidth /  frames;
    this.frameHeight = img.naturalHeight;

    this.animationTime = 0;
    this.frame = 0;
  }

  update(delta) {
    if (this.frames > 1) {
      this.animationTime += delta;
  
      const currentAnimationTime = this.animationTime % this.animationDuration;
  
      this.frame = Math.floor( this.frames * currentAnimationTime / this.animationDuration );
    }
  }

  getSpriteData() {
    return [
      this.img,
      this.frame * this.frameWidth,
      0,
      this.frameWidth,
      this.frameHeight,
    ];
  }
}