import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "./redux/reducer";
import DisplayOnlineUsers from "./DisplayOnlineUsers/displayOnlineUsers";
import { setDisplayOnlineUsers } from "./redux/displayOnlineUser/slice";

export default function Games() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const showOnlineUsers: boolean = useSelector(
        (state: RootState) => state.displayOnlineUsers
    );

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
