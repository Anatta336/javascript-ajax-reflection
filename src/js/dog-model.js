/**
 * Class representing the photo of a dog.
 */
export default class DogModel {
  constructor (url, altText, creatorName, creatorUrl) {
    /**
     * URL of the image, can add query to request a specific size.
     * e.g. &q=80&w=128 for a 80% quality jpeg with 128px width
     */
    this.url = url;
    /**
     * A string of text that describes the image, suitable for use as alt text.
     */
    this.altText = altText;
    /**
     * The name of the photographer who created the image.
     */
    this.creatorName = creatorName;
    /**
     * URL of the creator's page on Unsplash.com
     */
    this.creatorUrl = creatorUrl;
  }
}