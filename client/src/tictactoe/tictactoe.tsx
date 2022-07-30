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

    const newMove = useSelector((state: RootState) => state.playedMove);

    useEffect(() => {
        // Set the first Turn
        setTurn(gameInfo.player1);

        let symbol: string = "";
        newMove.played_user_id == gameInfo.player1.user_id
            ? (symbol = gameInfo.player1.symbol)
            : (symbol = gameInfo.player2.symbol);
        board[newMove.col][newMove.row] = symbol;
        console.log("Board newMove change", board);

        newMove.played_user_id == gameInfo.player1.user_id
            ? setTurn(gameInfo.player2)
            : setTurn(gameInfo.player1);
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
            };
            console.log("Message to send the server:", msg);

            socket.emit("played-move", msg);
        }
    }
    return (
        <>
            <div className="tic-tac-toe-board">
                <div>
                    <pre>{JSON.stringify(turn)}</pre>
                    {/* <p>{console.log(turn)}</p> */}
                    {turn && (
                        <>
                            <h3>{turn.alias}</h3>
                            <h3>{turn.symbol}</h3>
                        </>
                    )}
                </div>
                <div className="colum">
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
                </div>
            </div>
        </>
    );
}
