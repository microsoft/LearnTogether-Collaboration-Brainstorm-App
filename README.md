# Lets Brainstorm

Brainstorm is an example of using the Fluid Framework to build a collaborative line of business application. In this example each user can create their own sticky notes that is managed on a board. Ideas that have been "liked" appear
in a list and are sorted based upon the number likes.

## Running the App Locally with FRS as the Fluid Service

To run this follow the steps below:

1. Open a terminal window at the root of the project.
1. Run `npm install` from the root
1. Run `export REACT_APP_FLUID_CLIENT=frs` in the terminal to create an environment variable (if using PowerShell run `$env:REACT_APP_FLUID_CLIENT='frs'`). This will cause the app to use FRS instead of Tinylicious for the Fluid service.
)
1. Run `npm start` to start the client
1. Navigate to `http://localhost:3000` in a browser tab

## Running the App Locally with Tinylicious as the Fluid Service

To run this follow the steps below:

1. Open a terminal window at the root of the project.
1. Run `npm install` from the root
1. Run `npm start` to start the client
1. Run `npx tinylicious` to start the "Tinylicious" test service locally (this is used for local development)
1. Navigate to `http://localhost:3000` in a browser tab

This package is based on the [Create React App](https://reactjs.org/docs/create-a-new-react-app.html), so much of the Create React App documentation applies.

## Using the Brainstorm App

1. Navigate to `http://localhost:3000`

You'll be taken to a url similar to 'http://localhost:3000/**#a9c16d13-43fa-413a-859c-514e5bcaba3c**' the path `#a9c16d13-43fa-413a-859c-514e5bcaba3c` specifies one brainstorm document.

2. Create another chrome tab with `http://localhost:3000/**#a9c16d13-43fa-413a-859c-514e5bcaba3c**`

Now you can create notes, write text, change colors and more!
