import 'whatwg-fetch';
import Disableable from './utility/disableable';
import PhotoApp from './photos-app/photo-app';
import EmailValidation from './validation/email-validation';
import removeAllChildren from './utility/remove-children';

// un-hide anything that's meant to be hidden only when there's no script support
document.querySelectorAll('.hide-if-no-script').forEach(element => {
  element.style.display = 'block';
})

/**
 * In place of the app's usual display, show a critical error message.
 * @param {string} message 
 */
function displayCriticalError(message) {
  const appContainer = document.querySelector('.app');
  if (!appContainer) {
    return;
  }

  const p = document.createElement('p');
  p.classList.add('warning');
  p.appendChild(document.createTextNode(message));

  removeAllChildren(appContainer);
  appContainer.appendChild(p);
}

try {
  const emailField = document.querySelector('#new-email');
  const emailButton = document.querySelector('#assign-new-email');
  const emailButtonDisable = new Disableable(emailButton);
  
  if (!unsplashAccessKey || unsplashAccessKey === 'KEY-GOES-HERE') {
    throw new Error('Unable to find an access key for Unsplash. It should be entered in ./dist/js/secret/unsplash-key.js');
  }
  
  const emailValidation = new EmailValidation(
    emailField,
    emailButtonDisable,
    document.querySelector('.email-warnings')
  );
  emailValidation.runValidation();

  const app = new PhotoApp(
    unsplashAccessKey,
    displayCriticalError,
    {
      currentDog: document.querySelector('.current'),
      loading: document.querySelector('.loading'),
      adoption: document.querySelector('.assignments'),
      displayList: document.querySelector('.email-list'),
      emailInput: emailField,
      newEmailButton: emailButton,
      emailButtonDisable: emailButtonDisable,
    }
  );
} catch (error) {
  displayCriticalError(error.message)

  // re-throw the error so it'll appear in the console with any extra information
  throw error;
}
