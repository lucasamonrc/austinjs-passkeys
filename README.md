# 🎲 AustinJS Passkeys

This simple application demonstrates how to set up passkey registration and verification flows using JavaScript. This code is to help people get familiar with the concepts and in no way is an attempt to inform how passkeys should be used in production in the context of user authentication.

## 🚀 Technologies

- [SimpleWebAuthn](https://simplewebauthn.dev/)
- [Vite](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)

## 🛠 Setup

This project is set up as an npm workspace containing two projects:
- [client](./client): This is the webpage where the user will sign up for an account with a passkey, and then sign in using it. The webpage is built with Vite and it uses the TailwindCSS play CDN for its basic styling. We also use Vite to create a proxy to the server, `http://localhost:3000/api` -> `http://localhost:8080/api`
- [server](./server): This is the back-end service used to generate registration/authentication requests and to verify registration/authentication responses. It is written with Express.js and implements a simple in-memory database.

The dependencies are managed at the root level for both the client and the server, running `npm install` on the root folder will install the necessary dependencies for both.

**Running the project:**
```sh
# Running client and server concurrently
npm run dev

# Running only the client
npm run dev:client

# Running only the server
npm run dev:server
```

## 📋 Meta

Lucas Castro – [lucasamonrc.dev](https://www.lucasamonrc.dev) – lucasamonrc@gmail.com

[@lucasamonrc](https://github.com/lucasamonrc)
