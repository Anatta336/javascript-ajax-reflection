import DogPhotos from './dog-photos';
import EmailValidation from './email-validation';
import Disableable from './disableable';

// un-hide anything that's meant to be hidden only when there's no script support
document.querySelectorAll('.hide-if-no-script').forEach(element => {
  element.style.display = 'block';
})

function tempEmailValidationCallback(email, isValid) {
  console.log(`${email} isValid? ${isValid}`);
}

const emailField = document.querySelector('#new-email');
const emailButton = document.querySelector('#visit-new-email');
const emailButtonDisable = new Disableable(emailButton);

const emailValidation = new EmailValidation(
  emailField,
  emailButtonDisable,
  document.querySelector('.email-warnings'),
  tempEmailValidationCallback
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

// FIXME: "Wow, it's the best dog! Who should they visit?" is visible during the img loading process.

// TODO: email validation, display meaningful error

// TODO: check for unsplashAccessKey being undefined or emptystring, and show a meaningful message

// TODO: circle styling on assigned dogs

// TODO: show author information on main photo display

// TODO: maybe show author name on hover over assigned dogs

// TODO: styling for assigned dog photos

// TODO: styling for assigned emails, remove the list mark and put buttons lined up?
