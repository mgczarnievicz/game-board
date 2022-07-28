import { Store } from "redux";
import { io, Socket } from "socket.io-client";
import { ticTacToeNextTurn } from "./redux/tictactoe/slice";
import { usersOnlineUpdate } from "./redux/usersOnline/slice";

import { TictactoeType, UserAlias } from "./typesClient";

export let socket: Socket;

export const init = (
    store: Store & {
        dispatch: unknown;
    }
) => {
    if (!socket) {
        socket = io();
    }

    socket.on("tic-tac-toe-msg", (nextP: TictactoeType) => {
        console.log("I received a Msg by Socket");
        // store.dispatch(ticTacToeNextTurn(nextP));
    });

    socket.on("testing-socket", () => {
        console.log("I received a Msg by Socket");
    });

    socket.on("online-users", (newMsg: Array<UserAlias>) => {
        store.dispatch(usersOnlineUpdate(newMsg));
    });
};
