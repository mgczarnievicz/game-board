import React from "react";
import { Link } from "react-router-dom";

export default function Games() {
    function linkToGo(linkToGo: string) {
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
