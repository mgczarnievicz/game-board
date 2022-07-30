import { Store } from "redux";
import { io, Socket } from "socket.io-client";

import { ticTacToeNextTurn } from "./redux/tictactoe/slice";
import { usersOnlineUpdate } from "./redux/usersOnline/slice";
import { setReceivedInvite } from "./redux/receivedInvite/slice";
import { clearDisplayOnlineUsers } from "./redux/displayOnlineUser/slice";

import { TictactoeType, UserAlias, InviteMsg } from "./typesClient";
import { RootState } from "./redux/reducer";

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
        console.log("online-users recevied", newMsg);
        store.dispatch(usersOnlineUpdate(newMsg));
    });

    socket.on("received-invite-to-play", (newMsg: InviteMsg) => {
        console.log("Received received-invite-to-play:", newMsg);
        // If I am not playing a game reject the invite.
        const state: RootState = store.getState();

        if (state.receivedInvite && state.playingGame) {
            // Reject the Invite
            // set the Invite GB to null.
            console.log("I am playing");
            socket.emit("reject-invite-to-play", newMsg);
        } else {
            store.dispatch(setReceivedInvite(newMsg));
        }

        console.log("state in received-invite-to-play", state);
    });

    socket.on("invite-accepted-join-room", (mesg) => {
        socket.emit("invite-accepted-join-room", mesg);
        store.dispatch(clearDisplayOnlineUsers());
        // eslint-disable-next-line no-restricted-globals
        if (location.pathname !== "/tictactoe") {
            // eslint-disable-next-line no-restricted-globals
            location.replace(`/tictactoe`);
        }
    });

    socket.on("start-game", (msg) => {
        console.log("Starts GAME!!!", msg);
    });
};
