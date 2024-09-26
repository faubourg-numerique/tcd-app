# tcd-app

## Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/)

## Installation

- Clone this repository

```
git clone https://github.com/faubourg-numerique/tcd-app.git
```

- Access the cloned repository

```
cd ./tcd-app
```

- Checkout to the desired tag

```
git checkout tags/0.0.0
```

- Create the environment file

```
cp ./.env.example ./.env
```

- Edit the environment file

- Install the dependencies

```
npm install
```

- Build the project

```
npm run build
```

> The compiled files will be located in the ./dist folder.

## Usage

- Host the entire contents of the ./dist folder on an Apache HTTP server
