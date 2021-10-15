# Lets Brainstorm

Brainstorm is an example of using the Fluid Framework to build a collaborative line of business application. In this example each user can create their own sticky notes that is managed on a board. Ideas that have been "liked" appear
in a list and are sorted based upon the number likes.
In addition, we're adding Azure Communication Services for interactive chat on the board.

## Set up Communication Services

### Create resources

1. [Create a Communication Services resource](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp) in the Azure Portal and navigate to *Keys* to note down your *connection string* and *endpoint*.
1. [Create a Storage Account resource](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal) in the Azure Portal and get your *connection string* under *Keys*.
1. In `src/azure/local.settings.json` set `AzureWebJobsStorage` to be your Storage Account connection string, `ResourceConnectionString` to be your Communication Services connection string, and `ResourceEndpoint` to be your Communication Services endpoint.
1. In `src/view/ChatPopUp.tsx` set `ENDPOINT` to be your Communication Services endpoint.

### Set up and run Azure Functions
We are using a minimal serverless backend for managing chat users and threads.
1. Install Azure Function Core Tools via `npm i -g azure-functions-core-tools`
1. If using VS Code, install the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for easy debugging and deployment.
1. Navigate to `src/azure` and run `npm install`
1. Run `npm run start` to run functions locally or deploy them with the Azure Functions extension.
1. In `src/Utils/api.ts` set `BASE_URL` to your functions url. This is the public url of your deployed functions app, or when running locally you can find it in your console logs, e.g. `http://localhost:7071/api`.


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

Now you can create notes, write text, change colors and have a chat!
