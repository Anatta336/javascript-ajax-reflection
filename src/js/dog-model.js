/**
 * Class representing the photo of a dog.
 */
export default class DogModel {
  constructor (smallUrl, tinyUrl, altText, creatorName, creatorUrl) {
    /**
     * URL of a "small" version of the photo, 400px wide.
     */
    this.smallUrl = smallUrl;
    /**
     * URL of a thumbnail sized version of the photo, 
     */
    this.tinyUrl = tinyUrl;
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