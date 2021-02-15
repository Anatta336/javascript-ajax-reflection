import DogPhotos from './dog-photos';
import EmailValidation from './email-validation';
import Disableable from './disableable';
import removeAllChildren from './remove-children';

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
  p.append(message);

  removeAllChildren(appContainer);
  appContainer.append(p);
}

try {
  const emailField = document.querySelector('#new-email');
  const emailButton = document.querySelector('#visit-new-email');
  const emailButtonDisable = new Disableable(emailButton);
  
  if (!unsplashAccessKey || unsplashAccessKey === 'KEY-GOES-HERE') {
    throw new Error('Unable to find an access key for Unsplash. It should be entered in ./dist/js/secret/unsplash-key.js');
  }
  
  const emailValidation = new EmailValidation(
    emailField,
    emailButtonDisable,
    document.querySelector('.email-warnings')
    );
    
    const dogPhotos = new DogPhotos(unsplashAccessKey, {
      photo: document.querySelector('.photo'),
      loading: document.querySelector('.loading'),
      adoption: document.querySelector('.adoption'),
      displayList: document.querySelector('.email-list'),
      emailInput: emailField,
      newEmailButton: emailButton,
      emailButtonDisable: emailButtonDisable,
    });
} catch (error) {
  displayCriticalError(error.message)

  // re-throw the error so it'll appear in the console with any extra information
  throw error;
}

// TODO: more meaningful email validation messages

// TODO: check for unsplashAccessKey being undefined or emptystring, and show a meaningful message

// TODO: circle styling on assigned dogs

// TODO: show author information on main photo display

// TODO: maybe show author name on hover over assigned dogs

// TODO: styling for assigned dog photos

// TODO: styling for assigned emails, remove the list mark and put buttons lined up?

// TODO: handle any errors from Unsplash

// TODO: photo should be hidden entirely during first load, not just be an element with no children
