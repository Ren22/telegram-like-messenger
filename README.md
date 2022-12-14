## Information

This is an online web-chat(similar to telegram web app version) built in plain Typescript without any frameworks. It relies on Websockets under the hood to send messages.

The architecture of the project is separated according to MVC.
Model part is responsible for communication with backend API and can be found in `services` directory.
View and Controllers are stored together per each component in the `components` and `pages` directories.
The core `Block.ts` implements EventBus and dynamically re-renderes once the properties of the Block are updated. The Block is a central functional part and is inhereted by all components/pages. 
The rendering is done with the help of `handlebars`.

All forms have a validation with regular expressions. The events are triggered on blur/focus of an input field.

A separate class to have HTTP requests based on XMLHttpRequest is introduced.

The Routing over `pages` uses History API.

Cookies are used to store a user session.

The project is tested with Mocha + Chai + Sinon + jsbin. Currently only the router is tested.

For CSS [BEM](https://en.bem.info/methodology/) methodoly is used.
![Login page](https://raw.githubusercontent.com/Ren22/telegram-like-messenger/main/static/snapshots/login.png)
![Messenger page](https://raw.githubusercontent.com/Ren22/telegram-like-messenger/main/static/snapshots/messenger.png)
## Chat functionality

A user can login or register on the login/registation page. 
After that a user is redirected to the messenger page where he can create/delete a chat.
User can also click on the profile link to edit personal information or logout from the app.

## Tech stack

* **Typescript** for core logic and components
* **handlebars** for page rendering
* **Mocha + Chai + Sinon + jsbin** for testing
* **Docker** for building an image
* **WebSockets** for posting messages to a chat
* **Webpack** for building a project
* **husky** to run unit tests and linting before a commit

## Installation

1. Clone or download this repository.
2. Run `npm i` in you command line interface.

## Start

1. `npm start` will start an application on PORT 3000.

## Dev Mode

1. `npm run dev` will start an application on PORT 8080 in dev mode.

## Build

1. `npm run build`

## Test

1. `npm test`

## Deployed Version
The project has a a Dockerfile to create an image. 
It is deployed @[heroku](https://telegram-like-messenger.herokuapp.com/).

## UI prototypes
[Figma prototypes](https://www.figma.com/file/0tnzcPJnhbMgOgE5XtB8qA/Chat-(Copy)?node-id=0%3A1)
