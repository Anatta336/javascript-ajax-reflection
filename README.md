# JavaScript Ajax Reflection

## About
This is a learning project created as part of the *Netmatters Ltd.* SCS training scheme.

A random image of a dog from Unsplash will be shown to the user, which they can assign to an email address. The assignment of images to email addresses is stored and displayed to the user. The data isn't sent off the user's computer and the only external communication is to fetch images from Unsplash.

## Building
Navigate to `./dist/js/secret/unsplash-key.js` and enter a valid Unsplash API access key, replacing the `KEY-GOES-HERE` text. As per the Unsplash terms, the API key is not stored in this public repository.

Assuming you already have [npm](https://www.npmjs.com/get-npm) installed on your machine, navigate to the root directory of the project and run the command:
```
npm install
```

If you're working on files in `src` and want the project to automatically be rebuilt with those changes you can run:
```
npm run watch
```

## Usage
After building and providing an Unsplash API key, opening `dist/index.html` locally in a web browser should display the page correctly.

If hosting, the `dist` directory and its subdirectories should be made available.

## Storage
By default localStorage will be used to store a small amount of data to track entered email addresses and which photo is assigned to each. Some browsers (notably IE11) do not allow localStorage to be used when a page is loaded from the local file system. In such cases where localStorage is not available, the same data is stored in a cookie instead.
