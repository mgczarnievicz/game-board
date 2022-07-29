import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "./redux/reducer";
import DisplayOnlineUsers from "./DisplayOnlineUsers/displayOnlineUsers";
import setDisplayOnlineUsers from "./redux/displayOnlineUser/slice";

export default function Games() {
    const dispatch = useDispatch();
    const showOnlineUsers: boolean = useSelector(
        (state: RootState) => state.displayOnlineUsers
    );

    function linkToGo(linkToGo: string) {
        // FIXME. TYPESCRIPT
        // dispatch(setDisplayOnlineUsers(true));
        console.log("Clicked linkToGo", linkToGo);
    }
    return (
        <>
            <div>games</div>

            <Link to="/tictactoe">
                <img
                    src={require("./img/TicTacToe.png")}
                    alt="Tic Tac Toe"
                    onClick={() => {
                        linkToGo("/tictactoe");
                    }}
                ></img>
            </Link>
        </>
    );
}
