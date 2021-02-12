export default class DogView {
  constructor (dogModel) {
    this.dogModel = dogModel;
  }

  createImg() {
    const img = document.createElement('img');
    img.src = this.dogModel.smallUrl;
    img.alt = this.dogModel.altText;
    return img;
  }
}