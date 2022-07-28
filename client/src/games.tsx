import React from "react";
import { Link } from "react-router-dom";

export default function Games() {
    return (
        <>
            <div>games</div>

            <Link to="/tictactoe">
                <img
                    src={require("./img/TicTacToe.png")}
                    alt="Tic Tac Toe"
                ></img>
            </Link>
        </>
    );
}
