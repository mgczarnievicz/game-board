import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "./redux/reducer";
import DisplayOnlineUsers from "./DisplayOnlineUsers/displayOnlineUsers";
import { setDisplayOnlineUsers } from "./redux/displayOnlineUser/slice";
import { clearPlayingGame } from "./redux/playingGame/slice";
import { clearNewGame } from "./redux/newGame/slice";
import { clearTicTacToeNextTurn } from "./redux/playedMove/slice";

export default function Games() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const showOnlineUsers: boolean = useSelector(
        (state: RootState) => state.displayOnlineUsers
    );

    useEffect(() => {
        //When I mount this page I clear all the games values.
        dispatch(clearTicTacToeNextTurn());
        dispatch(clearNewGame());
        dispatch(clearPlayingGame());
    }, []);
    function linkToGo(linkToGo: string) {
        dispatch(setDisplayOnlineUsers());
        console.log("Clicked linkToGo", linkToGo);
        navigate(linkToGo);
    }
    return (
        <>
            <div>games</div>

            {/* <Link to="/tictactoe"> */}
            <img
                src={require("./img/TicTacToe.png")}
                alt="Tic Tac Toe"
                onClick={() => {
                    linkToGo("/tictactoe");
                }}
            ></img>
            {/* </Link> */}
        </>
    );
}
