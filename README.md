# Game Board: Tic Tac Toe Live 🎮

A real-time multiplayer Tic Tac Toe game built as the final project of a 3-month bootcamp. Two players can compete live against each other through a game board interface powered by WebSockets.

## Running the Project

1. Clone the repository.

2. Install dependencies for the server and then for the client:

    ```bash
      npm install
    ```

3. Set up the server secrets by creating a `secrets.json` file inside the `server` folder:

    ```json
      {
        "USER_NAME": "yourDBusername",
        "USER_PASSWORD": "yourDBpassword",
        "COOKIE_SECRET": "yourCookieSecret"
      }
    ```

4. Run the client and server in two separate terminal tabs:

   - Inside the `client` folder:

      ```bash
          npm run start
      ```

   - Inside the `server` folder:

      ```bash
          npx ts-node server.ts
      ```

5. Open [localhost:3000](http://localhost:3000) in your browser.

## Overview

Tic Tac Toe Live is a full-stack real-time multiplayer game. Two players connect to the same game room and take turns placing their marks on the board. The game state is synchronized between both players instantly using **Socket.IO**, so every move is reflected live on both screens without any page refresh.

## Features

- 🎮 Real-time two-player gameplay via WebSockets
- 🔄 Live game state synchronization between players
- 🏆 Win and draw detection
- 🔐 Session management with cookies
- 🗄️ Persistent data storage with PostgreSQL
- 📱 Responsive UI

## Technologies

[![My Skills](https://skillicons.dev/icons?i=react,redux,typescript,nodejs,express,postgres,aws,css)](https://skillicons.dev)

- **React** — Frontend UI
- **Redux** — Global state management
- **TypeScript** — Type-safe JavaScript
- **Node.js & Express** — Backend server
- **Socket.IO** — Real-time bidirectional communication
- **PostgreSQL** — Relational database
- **CSS** — Styling

## Project Structure

```
/tic-tac-toe-live/
  ├── client/            # React frontend
  |    └── package.json  # Client scripts to run server for client
  └── server/            # Express backend
       └── secrets.json  # Environment secrets (not committed)
       └── package.json  # Server scripts to run server for Server
```

## Preview

### Registration

![Tic Tac Toe Live Preview](/gif-readme/board-game-registration.gif)

### Login

![Tic Tac Toe Live Preview](/gif-readme/board-game-login.gif)

### Points

![Tic Tac Toe Live Preview](/gif-readme/board-game-points.gif)

### Profile

![Tic Tac Toe Live Preview](/gif-readme/board-game-profile-new-image.gif)

### New Game

![Tic Tac Toe Live Preview](/gif-readme/board-game-playing-invitation.gif)

### End Game

![Tic Tac Toe Live Preview](/gif-readme/board-game-playing-winning.gif)
