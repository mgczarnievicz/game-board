import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducer";
import "./tictactoe.css";
import {
    PlayerInf,
    StartGameMsg,
    UserAlias,
    MsgPlayedMove,
} from "../typesClient";
import { socket } from "../socket";
import { updateFor } from "typescript";

const initUser: PlayerInf = {
    user_id: 0,
    alias: "",
    image_url: "",
    symbol: "",
    player: null,
};

export default function TicTacToe() {
    const myUser: UserAlias = useSelector((state: RootState) => state.user);

    const gameInfo: StartGameMsg = useSelector(
        (state: RootState) => state.gameInfo
    );

    const [turn, setTurn] = useState<PlayerInf>(initUser);
    const [board, setBoard] = useState<Array<Array<string>>>([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]);

    const [board1, setBoard1] = useState<Array<string>>(Array(9).fill(null));

    const newMove = useSelector((state: RootState) => state.playedMove);

    useEffect(() => {
        if (newMove.played_user_id) {
            console.log("I got a new MOVE!", newMove);

            let symbol: string = "";
            newMove.played_user_id == gameInfo.player1.user_id
                ? (symbol = gameInfo.player1.symbol)
                : (symbol = gameInfo.player2.symbol);
            board[newMove.col][newMove.row] = symbol;
            console.log("Board newMove change", board);

            newMove.played_user_id == gameInfo.player1.user_id
                ? setTurn(gameInfo.player2)
                : setTurn(gameInfo.player1);

            switch (newMove.status) {
                case "Turn":
                    break;
                case "Quit":
                    break;
                case "Winner":
                    break;
                case "Tie":
                    break;
                default:
                    break;
            }
        } else {
            console.log("Fist MOVE!");
            // Set the first Turn
            setTurn(gameInfo.player1);
        }
    }, [gameInfo, newMove, board]);

    /* 
    What i need to receive form server:
    if there is a winner.
    player turn to play

    */
    function clickedHandle(arrayIndex: number, index: number) {
        console.log(
            "Just Clicked in board arrayIndex:",
            arrayIndex,
            " index:",
            index
        );

        if (!turn.user_id) {
            console.log("I have tu ignore the clicked. Please select a Player");
            return;
        }

        if (turn.user_id == myUser.user_id) {
            //Its my turn
            const msg: MsgPlayedMove = {
                game_name: gameInfo.game_name,
                room_name: gameInfo.room_name,
                col: arrayIndex,
                row: index,
                played_user_id: myUser.user_id,
                status: "Turn",
                status_user_id: myUser.user_id,
            };
            console.log("Message to send the server:", msg);

            socket.emit("played-move", msg);
        }
    }
    function clickedHandle1(index: number) {
        console.log("Index Button clicked!", index);
    }
    const style = {
        background: "lightblue",
        border: "2px solid darkblue",
        fontSize: "30px",
        fontWeight: "800",
        cursor: "pointer",
        outline: "none",
    };
    return (
        <>
            <div className="tic-tac-toe-game">
                <div>
                    <pre>{JSON.stringify(turn)}</pre>
                    {/* <p>{console.log(turn)}</p> */}
                    {turn && (
                        <>
                            {turn.user_id == myUser.user_id && <h3>Your</h3>}
                            {turn.user_id != myUser.user_id && (
                                <h3>{turn.alias}</h3>
                            )}
                            <h3>Turn</h3>
                        </>
                    )}
                </div>

                <div className="tic-tac-toe-board">
                    <button
                        className="cell"
                        key={0}
                        value={board1[0]}
                        onClick={() => clickedHandle1(0)}
                    ></button>
                    <button
                        className="cell"
                        key={1}
                        value={board1[1]}
                        onClick={() => clickedHandle1(1)}
                    ></button>
                    <button
                        className="cell"
                        key={2}
                        value={board1[2]}
                        onClick={() => clickedHandle1(2)}
                    ></button>
                    <button
                        className="cell"
                        key={3}
                        value={board1[3]}
                        onClick={() => clickedHandle1(3)}
                    ></button>
                    <button
                        className="cell"
                        key={4}
                        value={board1[4]}
                        onClick={() => clickedHandle1(4)}
                    ></button>
                    <button
                        className="cell"
                        key={5}
                        value={board1[5]}
                        onClick={() => clickedHandle1(5)}
                    ></button>
                    <button
                        className="cell"
                        key={6}
                        value={board1[6]}
                        onClick={() => clickedHandle1(6)}
                    ></button>
                    <button
                        className="cell"
                        key={7}
                        value={board1[7]}
                        onClick={() => clickedHandle1(7)}
                    ></button>
                    <button
                        className="cell"
                        key={8}
                        value={board1[8]}
                        onClick={() => clickedHandle1(8)}
                    ></button>
                </div>

                {/* <div className="colum">
                    <div
                        className="cell cell-b-button"
                        onClick={() => clickedHandle(0, 0)}
                    >
                        <p> {board && board[0][0]} </p>
                    </div>
                    <div
                        className="cell cell-b-button cell-middle"
                        onClick={() => clickedHandle(0, 1)}
                    >
                        {board && board[0][1]}
                    </div>
                    <div
                        className="cell cell-b-button"
                        onClick={() => clickedHandle(0, 2)}
                    >
                        {board && board[0][2]}
                    </div>
                </div>
                <div className="colum">
                    <div
                        className="cell cell-b-button "
                        onClick={() => clickedHandle(1, 0)}
                    >
                        {board && board[1][0]}
                    </div>
                    <div
                        className="cell cell-b-button cell-middle"
                        onClick={() => clickedHandle(1, 1)}
                    >
                        {board && board[1][1]}
                    </div>
                    <div
                        className="cell cell-b-button"
                        onClick={() => clickedHandle(1, 2)}
                    >
                        {board && board[1][2]}
                    </div>
                </div>
                <div className="colum">
                    <div className="cell " onClick={() => clickedHandle(2, 0)}>
                        {board && board[2][0]}
                    </div>
                    <div
                        className="cell cell-middle"
                        onClick={() => clickedHandle(2, 1)}
                    >
                        {board && board[2][1]}
                    </div>
                    <div className="cell" onClick={() => clickedHandle(2, 2)}>
                        {board && board[2][2]}
                    </div>
                </div> */}
            </div>
        </>
    );
}
