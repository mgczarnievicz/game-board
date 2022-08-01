import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { clearNewGame } from "../redux/gameInfo/slice";
import { clearReceivedInvite } from "../redux/receivedInvite/slice";
import { clearPlayingGame } from "../redux/playingGame/slice";
import { clearPlayedMove } from "../redux/playedMove/slice";
import CountDown from "../countDown/countDown";

const initUser: PlayerInf = {
    user_id: 0,
    alias: "",
    image_url: "",
    symbol: "",
    player: null,
};

export default function TicTacToe() {
    const dispatch = useDispatch();

    const myUser: UserAlias = useSelector((state: RootState) => state.user);
    const newMove = useSelector((state: RootState) => state.playedMove);
    const gameInfo: StartGameMsg = useSelector(
        (state: RootState) => state.gameInfo
    );

    const [message, setMessage] = useState("");
    const [turn, setTurn] = useState<PlayerInf>(initUser);
    const [board, setBoard] = useState<Array<string>>(Array(9).fill(null));
    const [cellStyle, setCellStyle] = useState<Array<boolean>>(
        Array(9).fill(null)
    );

    console.log("cellStyle", cellStyle);

    useEffect(() => {
        function setMessageTurn() {
            if (turn.user_id == myUser.user_id) {
                //Msg Is your Turn
                setMessage("Is Your Turn");
            } else {
                // Msg is turn.alias Turn
                setMessage(`Is ${turn.alias} Turn`);
            }
        }
        if (newMove.played_user_id) {
            console.log("I got a new MOVE!", newMove);

            let symbol: string = "";
            newMove.played_user_id == gameInfo.player1.user_id
                ? (symbol = gameInfo.player1.symbol)
                : (symbol = gameInfo.player2.symbol);
            board[newMove.index] = symbol;
            console.log("Board newMove change", board);

            newMove.played_user_id == gameInfo.player1.user_id
                ? setTurn(gameInfo.player2)
                : setTurn(gameInfo.player1);

            switch (newMove.status) {
                case "Turn":
                    setMessageTurn();
                    break;
                case "Quit":
                    // Set Message the other player quite the game
                    console.log("the other player quite the game.");
                    setMessage(`The other player abandon the game. You Win`);
                    break;
                case "Winner":
                    if (newMove.status_user_id == myUser.user_id) {
                        //Msg Is your Turn
                        setMessage("You ARE THE WINNER");
                    } else {
                        // Msg is turn.alias Turn
                        setMessage(`You LOOSE`);
                    }

                    if (newMove.winnerArray) {
                        for (let i = 0; i < newMove.winnerArray.length; i++) {
                            cellStyle[newMove.winnerArray[i]] = true;
                        }
                    }
                    socket.emit("game-ended", {
                        room_name: gameInfo.room_name,
                    });
                    dispatch(clearPlayingGame());
                    break;
                case "Tie":
                    console.log("Tie");
                    setMessage(`Its a TIE`);
                    dispatch(clearPlayingGame());
                    break;
                default:
                    break;
            }
        } else {
            console.log("Fist MOVE!");
            // Set the first Turn
            setTurn(gameInfo.player1);
            setMessageTurn();
        }
    }, [gameInfo, newMove, board, turn, myUser.user_id, dispatch, cellStyle]);

    function clickedHandle(index: number) {
        console.log("Just Clicked in board ", index);

        if (!turn.user_id) {
            console.log("I have tu ignore the clicked. Please select a Player");
            return;
        }

        if (
            newMove.status == "Winner" ||
            newMove.status == "Quit" ||
            newMove.status == "Tie"
        ) {
            // The game has finish.
            return;
        }

        if (turn.user_id == myUser.user_id) {
            //Its my turn
            const msg: MsgPlayedMove = {
                game_name: gameInfo.game_name,
                room_name: gameInfo.room_name,
                index: index,
                played_user_id: myUser.user_id,
                status: "Turn",
                status_user_id: myUser.user_id,
            };
            console.log("Message to send the server:", msg);

            socket.emit("played-move", msg);
        }
    }

    return (
        <>
            <div className="tic-tac-toe-game">
                <CountDown />
                <div>
                    <pre>{JSON.stringify(newMove)}</pre>
                    {/* <p>{console.log(turn)}</p> */}
                    {message && (
                        <>
                            <h3>{message}</h3>
                        </>
                    )}
                </div>

                <div className="tic-tac-toe-board">
                    <button
                        className={`cell ${cellStyle[0] ? "winnerClass" : ""} `}
                        key={0}
                        value={board[0]}
                        onClick={() => clickedHandle(0)}
                    >
                        {board[0]}
                    </button>
                    <button
                        className={`cell ${cellStyle[1] ? "winnerClass" : ""} `}
                        key={1}
                        value={board[1]}
                        onClick={() => clickedHandle(1)}
                    >
                        {board[1]}
                    </button>
                    <button
                        className={`cell ${cellStyle[2] ? "winnerClass" : ""} `}
                        key={2}
                        value={board[2]}
                        onClick={() => clickedHandle(2)}
                    >
                        {board[2]}
                    </button>
                    <button
                        className={`cell ${cellStyle[3] ? "winnerClass" : ""} `}
                        key={3}
                        value={board[3]}
                        onClick={() => clickedHandle(3)}
                    >
                        {board[3]}
                    </button>
                    <button
                        className={`cell ${cellStyle[4] ? "winnerClass" : ""} `}
                        key={4}
                        value={board[4]}
                        onClick={() => clickedHandle(4)}
                    >
                        {board[4]}
                    </button>
                    <button
                        className={`cell ${cellStyle[5] ? "winnerClass" : ""} `}
                        key={5}
                        value={board[5]}
                        onClick={() => clickedHandle(5)}
                    >
                        {board[5]}
                    </button>
                    <button
                        className={`cell ${cellStyle[6] ? "winnerClass" : ""} `}
                        key={6}
                        value={board[6]}
                        onClick={() => clickedHandle(6)}
                    >
                        {board[6]}
                    </button>
                    <button
                        className={`cell ${cellStyle[7] ? "winnerClass" : ""} `}
                        key={7}
                        value={board[7]}
                        onClick={() => clickedHandle(7)}
                    >
                        {board[7]}
                    </button>
                    <button
                        className={`cell ${cellStyle[8] ? "winnerClass" : ""} `}
                        key={8}
                        value={board[8]}
                        onClick={() => clickedHandle(8)}
                    >
                        {board[8]}
                    </button>
                </div>
            </div>
        </>
    );
}
