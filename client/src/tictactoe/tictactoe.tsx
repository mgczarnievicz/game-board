import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducer";
import "./tictactoe.css";
import { UserAlias } from "../typesClient";

const initUser: UserAlias = {
    user_id: 0,
    alias: "",
    image_url: "",
};

export default function TicTacToe() {
    const myUser = useSelector((state: RootState) => state.user);

    const [winner, setWinner] = useState(null);
    const [turn, setTurn] = useState<UserAlias>(initUser);
    const [board, setBoard] = useState([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]);

    /* 
    What i need to receive form server:
    if there is a winner.
    player turn to play

    */
    function clickedHandle(arrayIndex: number, index: number) {
        if (turn.user_id === myUser.user_id) {
            // Its my turn.
            // Verify that the space is empty.
            // If yes, send the array to the sever via socket.
            if (!board[arrayIndex][index]) {
                // Is empty.
                board[arrayIndex][index] = 1;
            } else {
                // If not ignore.
            }
        } else {
            // Ignore
        }
    }
    return (
        <>
            <div className="tic-tac-toe-board">
                <div>{!winner}</div>
                <div className="colum">
                    <div className="cell cell-b-button">
                        <p> 0 0 </p>
                    </div>
                    <div className="cell cell-b-button cell-middle"> 0 1</div>
                    <div className="cell cell-b-button"> 02</div>
                </div>
                <div className="colum">
                    <div className="cell cell-b-button "> 1 0 </div>
                    <div className="cell cell-b-button cell-middle"> 1 1 </div>
                    <div className="cell cell-b-button"> 1 2 </div>
                </div>
                <div className="colum">
                    <div className="cell "> 2 0 </div>
                    <div className="cell cell-middle"> 2 1 </div>
                    <div className="cell"> 2 2 </div>
                </div>
            </div>
        </>
    );
}