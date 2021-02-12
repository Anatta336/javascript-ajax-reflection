import DogModel from "./dog-model";

export default class PhotoSource {
  constructor (unsplashAccessKey) {
    this.headers = new Headers();

    this.headers.append('Authorization', `Client-ID ${unsplashAccessKey}`);
    this.headers.append('Accept-Version', 'v1');

    this.perPage = 30;
    this.searchUrl = `https://api.unsplash.com/search/photos?query=dog&orientation=portrait&per_page=${this.perPage}&order_by=relevant&content_filter=high`;

    // the "dog" search can turn up images which aren't dogs, so only look at the most relevant
    this.pageCountFraction = 0.25;

    // TODO: this promise is executed as soon as it's created.
    // I think I'd like it to be lazily executed intead.
    console.log('before creating promise');
    this.pagesAvailable = new Promise((fulfill, reject) => {
      console.log('within promise');
      fetch(this.searchUrl, { headers: this.headers })
      .then(response => {
        if (!response.ok) {
          return response.json()
            .then(errorData => {
              const error = new Error('Error when trying to find the total pages available.');
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
        reject(error);
      });
    });
    console.log('after creating promise');
  }

  /**
   * Attempts to fetch the details of a random dog photo.
   * @returns {Promise<DogModel>} A promise that fulfills to an instance of Dog
   * that describes a random photo.
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
            const error = new Error('Error when trying to fetch random page of results.');
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
        dogData.urls.small,
        dogData.urls.thumbnail,
        dogData.description,
        dogData.user.name,
        dogData.user.links.html,
      );
    })
    .catch(error => {
      console.error(error);
    })
  }
}