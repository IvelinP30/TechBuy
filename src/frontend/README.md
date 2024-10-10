## Description

TechBuy is an e-commerce platform designed to provide users with a seamless experience for browsing and purchasing electronic devices.
The application uses modern web technologies like Angular, Angular Material, and RxJS to deliver a fast and responsive UI.
The app supports both light and dark themes and is optimized for accessibility and mobile devices.
It also integrates Microsoft authentication for secure login and supports two languages: Bulgarian (BG) and English (EN).

## Features

- Microsoft Authentication: Secure login using Microsoft Authentication.
- Multilingual Support: Supports both Bulgarian and English.
- Dark Mode: User can toggle between light and dark themes.
- Responsive Design: Fully responsive for all device sizes.
- Built with Angular: Uses Angular for structure and logic.
- Angular Material: Provides a polished UI with Material Design principles.
- Cookie Service: Uses ngx-cookie-service for managing cookies.

## Installation

Clone the repository:

`git clone https://github.com/your-username/techbuy-frontend.git`

Software Needs to be installed:

- Install Node version: 18.20.2
- Install Java: 17
- Install Angular vesion: 18 (latest)
- Install yarn version: 1.22.22

Steps To Buils and run angular frontend application:
1. Go To frontend directroy of application and follow below steps
2. Install dependencies:  yarn install
3. Build for development: yarn build
4. Build for production: yarn build --prod
5. Serve the application locally: yarn start

Steps To Run Both Frontend and backedn as single jar:
1. Build: Go to TechBuy directory and run command:  mvn clean install 
2. Run : Go to target folder and run java -jar techbuy-1.0.0-SNAPSHOT-runner.jar

The app will be available at http://localhost:4200.

## Usage

Once the app is running locally:

- Open your browser and visit http://localhost:4200.
- You will be prompted to log in using Microsoft Authentication.
- You can switch languages between Bulgarian and English via the language selector.
- Dark mode can be toggled through the theme switcher in the UI.

## Scripts

Here are the available npm scripts for development and testing:

- npm start: Runs the application in development mode using ng serve.
- npm run build: Builds the Angular application for production.
- npm run watch: Watches for changes and builds the application in development mode.
- npm test: Runs unit tests using Karma and Jasmine.

## Acknowledgments

- Angular: For providing the framework.
- Angular Material: For the pre-built UI components.
- Microsoft Authentication: For secure user login.
- ngx-translate: For providing multilingual support.