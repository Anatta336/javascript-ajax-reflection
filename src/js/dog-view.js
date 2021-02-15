export default class DogView {
  constructor (dogModel) {
    /**
     * The DogModel to represent.
     * @type {DogModel}
     */
    this.dogModel = dogModel;

    /**
     * Width of photo to fetch, in px.
     * @type {number}
     */
    this.photoWidth = 400;
  }

  createImg() {
    const img = document.createElement('img');
    img.src = `${this.dogModel.url}&q=80&w=${this.photoWidth}`;
    img.alt = this.dogModel.altText;
    return img;
  }
}