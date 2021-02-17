import DogModel from './dog-model';

/**
 * Provides an interface to the Unsplash API, specifically to provide
 * photos in the form of DogModels.
 */
export default class PhotoSource {
  /**
   * Create an instance of PhotoSource.
   * @param {string} unsplashAccessKey Access key to be used with Unsplash.
   * @param {displayError} displayError Callback function that will display an error.
   */
  constructor (unsplashAccessKey, displayError) {
    /**
     * @type {displayError}
     */
    this.displayError = displayError;

    /**
     * Headers to provide to every fetch request to Unsplash.
     * @type {Headers}
     */
    this.headers = new Headers();
    this.headers.append('Authorization', `Client-ID ${unsplashAccessKey}`);
    this.headers.append('Accept-Version', 'v1');

    /**
     * How many dog photos should be returned per page.
     * @type {number}
     */
    this.perPage = 30;

    /**
     * URL to the Unsplash API that performs a search for suitable dog photos.
     * @type {string}
     */
    this.searchUrl = `https://api.unsplash.com/search/photos?query=dog&orientation=portrait&per_page=${this.perPage}&order_by=relevant&content_filter=high`;

    /**
     * The search can produce photos that aren't what we're looking for, so sort by relevance and
     * only pick from the the most relevant top fraction.
     * @type {number}
     */
    this.pageCountFraction = 0.25;

    /**
     * Promise that fulfills to the total of how many pages of dog photos are available.
     * @type {Promise<number>}
     */
    this.pagesAvailable = new Promise((fulfill, reject) => {
      fetch(this.searchUrl, { headers: this.headers })
      .then(response => {
        if (!response.ok) {
          return response.json()
            .then(errorData => {
              const error = new Error(`${response.status} trying to find the total pages available.`);
              error.data = errorData;
              throw error;
            })
        }
        return response.json();
      })
      .then(data => {
        // round down, so any page we request will always be full
        const fullPages = Math.floor(data.total / this.perPage);
        fulfill(fullPages);
      })
      .catch(error => {
        this.displayError(error.message);
        reject(error);
      });
    });
  }

  /**
   * Attempts to fetch the details of a random dog photo.
   * @returns {Promise<DogModel>} A promise that fulfills to a DogModel giving the
   * details of a random photo.
   */
  randomDog() {
    return this.pagesAvailable
    .then(pageCount => {
      // only check the first fraction of all the available pages
      const countToUse = Math.max(Math.floor(pageCount * this.pageCountFraction), 1);
      const page = Math.floor(Math.random() * countToUse) + 1;
      return fetch(`${this.searchUrl}&page=${page}`, { headers: this.headers });
    })
    .then(response => {
      if (!response.ok) {
        return response.json()
          .then(errorData => {
            const error = new Error(`${response.status} when trying to fetch random page of results.`);
            error.data = errorData;
            throw error;
          })
      }
      return response.json();
    })
    .then(data => {
      const index = Math.floor(Math.random() * data.results.length);
      const dogData = data.results[index];
      return new DogModel(
        dogData.urls.raw,
        dogData.alt_description,
        dogData.user.name,
        dogData.user.links.html,
        dogData.width,
        dogData.height,
      );
    })
    .catch(error => {
      this.displayError(error.message);
      throw error;
    });
  }
}
