import DogModel from './dog-model';

/**
 * Creates HTML elements for the photo and a credit for its creator.
 * @param {DogModel} dogModel Dog photo to display.
 * @param {number} photoWidth Horizontal size of photo to fetch, in px.
 * @returns {{img: HTMLImageElement, credit: HTMLAnchorElement}}
 * .img is an image element holding the photo, .credit is an anchor element
 * naming the photo's creator and linking to their page on Unsplash.
 */
export default function dogImgAndCredit(dogModel, photoWidth) {
  const img = document.createElement('img');
  img.src = `${dogModel.url}&q=80&w=${photoWidth}`;
  img.width = `${photoWidth}`;
  if (dogModel.aspectRatio) {
    img.height = `${photoWidth / dogModel.aspectRatio}`;
  }
  img.alt = dogModel.altText;    

  const credit = document.createElement('a');
  credit.classList.add('credit');
  credit.href = dogModel.creatorUrl;
  credit.appendChild(document.createTextNode(`Photo by ${dogModel.creatorName}`));
  return {
    img,
    credit,
  };
}
