import DogModel from './dog-model';

export default class DogView {
  /**
   * Creates HTML elements for the photo and a credit for its creator.
   * @param {DogModel} dogModel Dog photo to display.
   * @param {number} photoWidth Horizontal size of photo to fetch, in px.
   * @returns {{img: HTMLImageElement, credit: HTMLAnchorElement}}
   * .img is an image element holding the photo, .credit is an anchor element
   * naming the photo's creator and linking to their page on Unsplash.
   */
  static createImageAndCredit(dogModel, photoWidth) {
    const img = DogView.createImg(dogModel, photoWidth);

    const credit = document.createElement('a');
    credit.classList.add('credit');
    credit.href = dogModel.creatorUrl;
    credit.appendChild(document.createTextNode(`Photo by ${dogModel.creatorName}`));
    return {
      img,
      credit,
    };
  }

  /**
   * Creates an image element using the data from this DogModel.
   * @param {DogModel} dogModel Dog photo to display.
   * @param {number} photoWidth Horizontal size of photo to fetch, in px.
   * @returns {HTMLImageElement} img element set up to display this DogModel's photo.
   */
  static createImg(dogModel, photoWidth) {
    const img = document.createElement('img');
    img.src = `${dogModel.url}&q=80&w=${photoWidth}`;
    img.alt = dogModel.altText;
    return img;
  }
}
