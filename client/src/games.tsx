import "./games.css";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "./redux/reducer";
import DisplayOnlineUsers from "./DisplayOnlineUsers/displayOnlineUsers";
import { setDisplayOnlineUsers } from "./redux/displayOnlineUser/slice";
import { clearPlayingGame } from "./redux/playingGame/slice";
import { clearNewGame } from "./redux/gameInfo/slice";
import { clearPlayedMove } from "./redux/playedMove/slice";
import { socket } from "./socket";
import { StartGameMsg } from "./typesClient";
import { clearReceivedInvite } from "./redux/receivedInvite/slice";

export default function Games() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const showOnlineUsers: boolean = useSelector(
        (state: RootState) => state.displayOnlineUsers
    );
    const playingGame: boolean = useSelector(
        (state: RootState) => state.playingGame
    );

    const gameInfo: StartGameMsg = useSelector(
        (state: RootState) => state.gameInfo
    );

    function gameEnded() {
        dispatch(clearPlayingGame());
        dispatch(clearReceivedInvite());
        dispatch(clearNewGame());
        dispatch(clearPlayedMove());
    }

    useEffect(() => {
        //When I mount this page I clear all the games values.
        if (playingGame) {
            // Let know the server that you quit a game.
            socket.emit("quite-game", {
                room_name: gameInfo.room_name,
                game_name: gameInfo.game_name,
            });
        }
        gameEnded();
    }, []);

    function linkToGo(linkToGo: string) {
        dispatch(setDisplayOnlineUsers());
        console.log("Clicked linkToGo", linkToGo);
        navigate(linkToGo);
    }
    return (
        <div className="games">
            <h1>Tic Tac Toe</h1>

            {/* <Link to="/tictactoe"> */}
            <img
                src={require("./img/TicTacToe.png")}
                alt="Tic Tac Toe"
                onClick={() => {
                    linkToGo("/tictactoe");
                }}
            ></img>
            {/* </Link> */}
        </div>
    );
}
