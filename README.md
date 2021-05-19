# polls-app

The project is divided in client (frontend) and server (backend) folders. 

## Backend --> yarn install
Run yarn install on /project/folder/server to install all dependencies.

To try the retrieve-forgotten-password functionality put a valid e-mail and password on the nodemailerConfig.js file on /server/config/nodemailerConfig.js

## yarn dev
Run yarn dev on /project/folder/server to launch the server and connect to the database.


## Frontend --> yarn install
Run yarn install on /project/folder/client to install all needed dependencies.

## yarn start
Run yarn start on /project/folder/client to start the development server and go to http://localhost:3000/ to interact with the app.

On the client folder you will find among other folders those mentioned below:

[auth]: containing all components related to authorization and privileges.

[poll]: all components related to poll(s) as seen by the user in the browser.

[user]: all components related to user actions and views.

[core]: all components that are common to the whole app.

The project consist of an app where users, power-users and admins can vote Telegram-like polls.
Power-users can create, close or open polls.
Admins have the same privileges of power-users and can create, edit and delete users as well.

## Try it as admin:

email: admin@test.com

password: admintest

## You can as admin create a user as power-user privileges or sign in as:

email: poweruser@test.com

password: powertest

To try it as a user just follow the registration flow of a regular website.

CSS and issues/bugs are still under review and correction. I will highly appreciate if in the meantime you find issues or anything that can be improved.

## Implementation of redirecting in case of network/server down still pending.
