import React, { useState } from "react";
import "./tictactoe.css";

export default function TicTacToe() {
    const [winner, setWinner] = useState(null);
    const [board, setBoard] = useState([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]);
    return (
        <>
            <div className="tic-tac-toe-board">
                <div className="colum">
                    <div className="cell cell-b-button"></div>
                    <div className="cell cell-b-button"></div>
                    <div className="cell"></div>
                </div>
                <div className="colum">
                    <div className="cell cell-b-button cell-middle"></div>
                    <div className="cell cell-b-button cell-middle"></div>
                    <div className="cell cell-middle"></div>
                </div>
                <div className="colum">
                    <div className="cell cell-b-button"></div>
                    <div className="cell cell-b-button"></div>
                    <div className="cell"></div>
                </div>
            </div>
        </>
    );
}
