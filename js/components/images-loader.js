const imagesLoader = {
  load(imageSources) {
    const imageLoadings = imageSources.map(
      imageSource => new Promise(
        (resolve, reject) => {
          if (this.cache[imageSource]) {
            resolve();
          } else {
            const img = new Image();
            img.src = imageSource;

            this.cache[imageSource] = img;

            img.onload = () => resolve();
          }
        }
      )
    );

    return Promise.all(imageLoadings);
  },

  get(imageSource) {
    return this.cache[imageSource];
  },

  cache: {},
}

export default imagesLoader;