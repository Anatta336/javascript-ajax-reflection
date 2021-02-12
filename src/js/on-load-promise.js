/**
 * Creates a promise that will fufill when the given image element has finished loading.
 * @param {HTMLImageElement} element An HTMLImageElement that will be monitored.
 */
export default function onLoadPromise(element) {
  return new Promise((fulfill, reject) => {
    // if image is already loaded, immediately fulfill
    if (element.complete) {
      fulfill(element);
      return;
    }

    // listen for loading to complete, then fulfill
    element.addEventListener('load', () => {
      fulfill(element);
    });

    // or reject if there's an error
    element.addEventListener('error', (error) => {
      reject(error);
    });
  });
}