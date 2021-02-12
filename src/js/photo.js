export default function makeUnsplash() {
  const urlStart = 'https://api.unsplash.com';

  const headers = new Headers();

  // unsplashAccessKey is defined in a separate file to help keep it secret
  headers.append('Authorization', `Client-ID ${unsplashAccessKey}`);
  headers.append('Accept-Version', 'v1');

  const perPage = 30;
  const searchUrl = `${urlStart}/search/photos?query=dog&orientation=portrait&per_page=${perPage}&order_by=relevant&content_filter=high`;
  
  // the "dog" search can turn up images which aren't dogs, so only look at the most relevant
  const pageCountFraction = 0.25;

  /**
   * A promise to find how many pages are available.
   */
  const pagesAvailable = new Promise((fulfill, reject) => {
    fetch(searchUrl, { headers: headers })
      .then(response => {
        if (!response.ok) {
          return response.json()
            .then(errorData => {
              const error = new Error('Something went wrong trying to find the total pages available.');
              error.data = errorData;
              throw error;
            })
        }
        return response.json();
      })
      .then(data => {
        // for simplicity round down, so any page we request will always be full
        const fullPages = Math.floor(data.total / perPage);
        fulfill(fullPages);
      })
      .catch(error => {
        reject(error);
      });
  });

  /**
   * 
   * @returns {object} 
   */
  function randomDog() {
    return pagesAvailable
      .then(pageCount => {
        const page = Math.floor(Math.random() * pageCount * pageCountFraction) + 1;
        return fetch(`${searchUrl}&page=${page}`, { headers: headers });
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
        console.log('random page of dogs:');
        console.log(data);
        const index = Math.floor(Math.random() * data.results.length);
        const dog = data.results[index];
        return {
          url: dog.urls.small,
          alt: dog.description,
          photographer: {
            name: dog.user.name,
            url: dog.user.links.html,
          },
        }
      })
      .catch(error => {
        console.error(error);
      })
  }

  return {
    randomDog,
  }
}
