Forked from https://staticsiteboilerplate.com/

* Homepage: [http://staticsiteboilerplate.com/](http://staticsiteboilerplate.com//)
* Documentation: [https://docs.staticsiteboilerplate.com/](https://docs.staticsiteboilerplate.com/)

## Installation

Requirements:  
* node v14 (and I don't recommend to change it to higher version, if higher version is installed, try to make it lower by **nvm** for [mac, linux](https://github.com/nvm-sh/nvm) or [windows](https://github.com/coreybutler/nvm-windows)

Navigate to the project folder and install the dependencies by: 

```
npm install
```

or (if pnpm is installed)

```
pnpm install
```

## Build

To build project easily run command

```
npm run build
```

or (if pnpm is installed)

```
pnpm run build
```

This command will create `dist` folder in the project root with all necessary HTML, CSS, JS and assets files

## Important things

### Navigation & routing

`body` tag on each page should have `data-page` attribute with appropriate values. This attribute is used for routing, navigation and animation.

* Home - `data-page="home"`
* About - `data-page="about"`
* Referral partners - `data-page="home"`
* Privacy policy - `data-page="privacy-policy"`
* 404 - `data-page="404"`

To make navigation smooth, you will find `<a>` tags with `data-internal`, `data-page` and `href` attributes. For example link to home page will be:

```HTML
<a data-internal data-page="home" href="/">Home</a>
```

### Animation

HTML-code is pretty coupled with JS, so **don't change it** without understanding the consequences.

P.S. Sorry for the mess with tailwind.css, I tried it for the first time and it was a huge mistake 😔

Let me know if you have any questions.
