import { Store } from "redux";
import { io, Socket } from "socket.io-client";

import { usersOnlineUpdate } from "./redux/usersOnline/slice";
import { setReceivedInvite } from "./redux/receivedInvite/slice";
import { clearDisplayOnlineUsers } from "./redux/displayOnlineUser/slice";
import { setPlayingGame, clearPlayingGame } from "./redux/playingGame/slice";
import { setNewGame } from "./redux/gameInfo/slice";
import { ticTacToeNextTurn } from "./redux/playedMove/slice";

import {
    TictactoeType,
    UserAlias,
    InviteMsg,
    StartGameMsg,
    MsgPlayedMove,
} from "./typesClient";
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

    socket.on("invite-accepted-join-room", (msg: InviteMsg) => {
        store.dispatch(clearDisplayOnlineUsers());
        store.dispatch(setPlayingGame());
        socket.emit("invite-accepted-join-room", msg);
        // eslint-disable-next-line no-restricted-globals
        if (location.pathname !== "/tictactoe") {
            // eslint-disable-next-line no-restricted-globals
            location.replace(`/tictactoe`);
        }
    });

    socket.on("start-game", (msg: StartGameMsg) => {
        //set the other plyer
        store.dispatch(setNewGame(msg));
        console.log("Starts GAME!!!\n", msg);
    });

    socket.on("played-move", (msg: MsgPlayedMove) => {
        //set the other plyer
        store.dispatch(ticTacToeNextTurn(msg));
        console.log("played-move!\n", msg);
    });

    socket.on("quite-game", (msg: MsgPlayedMove) => {
        //set the other plyer
        store.dispatch(ticTacToeNextTurn(msg));
        console.log("Quite Game!\n", msg);
        socket.emit("received-quite-game", msg);
        store.dispatch(clearPlayingGame());
    });
};
