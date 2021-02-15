import DogModel from './dog-model';

export default class DogView {
  /**
   * Create a new DogView for the given DogModel.
   * @param {DogModel} dogModel The dog to represent.
   * @param {number} photoWidth Width of photo to display, in px.
   */
  constructor (dogModel, photoWidth = 400) {
    /**
     * The DogModel to represent.
     * @type {DogModel}
     */
    this.dogModel = dogModel;

    /**
     * Width of photo to fetch, in px.
     * @type {number}
     */
    this.photoWidth = photoWidth;
  }

  /**
   * Creates HTML elements for the photo and a credit for its creator.
   * @returns {{img: HTMLImageElement, credit: HTMLAnchorElement}}
   * .img is an image element holding the photo, .credit is an anchor element
   * naming the photo's creator and linking to their page on Unsplash.
   */
  createImageAndCredit() {
    const img = this.createImg();

    const credit = document.createElement('a');
    credit.classList.add('credit');
    credit.href = this.dogModel.creatorUrl;
    credit.append(`Photo by ${this.dogModel.creatorName}`);

    return {
      img,
      credit,
    };
  }

  /**
   * Creates an image element using the data from this DogModel.
   * @returns {HTMLImageElement} img element set up to display this DogModel's photo.
   */
  createImg() {
    const img = document.createElement('img');
    img.src = `${this.dogModel.url}&q=80&w=${this.photoWidth}`;
    img.alt = this.dogModel.altText;
    return img;
  }
}