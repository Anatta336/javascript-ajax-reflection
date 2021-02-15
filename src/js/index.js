import DogPhotos from './dog-photos';

// un-hide anything that's meant to be hidden only when there's no script support
document.querySelectorAll('.hide-if-no-script').forEach(element => {
  element.style.display = 'block';
})

const dogPhotos = new DogPhotos(unsplashAccessKey, {
  photo: document.querySelector('.photo'),
  loading: document.querySelector('.loading'),
  adoption: document.querySelector('.email-list'),
  emailInput: document.querySelector('#new-email'),
  newEmailButton: document.querySelector('#visit-new-email'),
});

// TODO: check for unsplashAccessKey being undefined or emptystring, and show a meaningful message

// TODO: email validation, display meaningful error

// TODO: circle styling on assigned dogs

// TODO: maybe show author name on hover over assigned dogs

// TODO: load new dog after assigning current

// TODO: styling for assigned dog photos

// TODO: styling for assigned emails, remove the list mark and put buttons lined up?
