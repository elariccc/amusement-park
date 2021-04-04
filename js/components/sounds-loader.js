const soundsLoader = {
  load(soundSources) {
    const soundLoadings = soundSources.map(
      soundSource => new Promise(
        (resolve, reject) => {
          if (this.cache[soundSource]) {
            resolve();
          } else {
            const sound = new Audio();
            sound.src = soundSource;

            this.cache[soundSource] = sound;

            sound.oncanplaythrough = () => resolve();
          }
        }
      )
    );

    return Promise.all(soundLoadings);
  },

  get(soundSource) {
    return this.cache[soundSource].cloneNode();
  },

  cache: {},
}

export default soundsLoader;