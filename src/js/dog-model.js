/**
 * Class representing the photo of a dog.
 */
export default class DogModel {
  /**
   * Creates a new DogModel holding the provided data.
   * @param {string} url Base URL of the image.
   * @param {string} altText Text describing the image, suitable for use as alt text.
   * @param {string} creatorName Name of the image's creator.
   * @param {string} creatorUrl URL to the image creator's page on Unsplash.
   */
  constructor (url, altText, creatorName, creatorUrl) {
    /**
     * URL of the image, can add query to request a specific size.
     * e.g. &q=80&w=128 for a 80% quality jpeg with 128px width
     * @type {string}
     */
    this.url = url;

    /**
     * A string of text that describes the image, suitable for use as alt text.
     * @type {string}
     */
    this.altText = altText;

    /**
     * The name of the photographer who created the image.
     * @type {string}
     */
    this.creatorName = creatorName;

    /**
     * URL of the creator's page on Unsplash.com
     * @type {string}
     */
    this.creatorUrl = creatorUrl;
  }
}
