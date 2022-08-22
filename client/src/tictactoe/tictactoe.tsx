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
import { useNavigate } from "react-router-dom";

const initUser: PlayerInf = {
    user_id: 0,
    alias: "",
    image_url: "",
    symbol: "",
    player: null,
};

export default function TicTacToe() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const myUser: UserAlias = useSelector((state: RootState) => state.user);
    const newMove = useSelector((state: RootState) => state.playedMove);
    const gameInfo: StartGameMsg = useSelector(
        (state: RootState) => state.gameInfo
    );
    const playingGame: boolean = useSelector(
        (state: RootState) => state.playingGame
    );

    const [gameFinish, setGameFinish] = useState(false);
    const [myTurn, setMyTurn] = useState(false);

    const [buttonName, setButtonName] = useState("Quite Game");

    const [message, setMessage] = useState("");
    const [turn, setTurn] = useState<PlayerInf>(initUser);
    const [board, setBoard] = useState<Array<string>>(Array(9).fill(null));
    const [cellStyle, setCellStyle] = useState<Array<boolean>>(
        Array(9).fill(null)
    );

    useEffect(() => {
        function setMessageTurn() {
            if (turn.user_id == myUser.user_id) {
                //Msg Is your Turn
                setMyTurn(true);
                setMessage("Is Your Turn");
            } else {
                // Msg is turn.alias Turn
                setMyTurn(false);
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
            // console.log("Board newMove change", board);

            newMove.played_user_id == gameInfo.player1.user_id
                ? setTurn(gameInfo.player2)
                : setTurn(gameInfo.player1);

            switch (newMove.status) {
                case "Turn":
                    setMessageTurn();
                    break;
                case "Quit":
                    // Set Message the other player quite the game, stop the timer!
                    console.log("the other player quite the game.");
                    setMessage(`The other player abandon the game. You Win`);
                    setButtonName("Back");
                    setGameFinish(true);
                    break;
                case "Winner":
                    if (newMove.status_user_id == myUser.user_id) {
                        //Msg Is your Turn
                        setMessage("You ARE THE WINNER");
                    } else {
                        // Msg is turn.alias Turn
                        setMessage(`You LOST`);
                    }

                    if (newMove.winnerArray) {
                        for (let i = 0; i < newMove.winnerArray.length; i++) {
                            cellStyle[newMove.winnerArray[i]] = true;
                        }
                    }
                    socket.emit("game-ended", {
                        room_name: gameInfo.room_name,
                    });
                    setButtonName("Back");
                    setGameFinish(true);
                    break;
                case "Tie":
                    console.log("Tie");
                    setMessage(`Its a TIE`);
                    setButtonName("Back");
                    setGameFinish(true);
                    break;
                case "TimeUp":
                    if (myUser.user_id == newMove.played_user_id) {
                        console.log("Time's Up! You Lost");
                        setMessage("Time's Up! You Lost");
                    } else {
                        console.log("Time's Up! You Win");
                        setMessage("Time's Up! You Win");
                        socket.emit("game-ended", {
                            room_name: gameInfo.room_name,
                        });
                    }
                    setButtonName("Back");
                    setGameFinish(true);
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
        // console.log("Just Clicked in board ", index);

        if (!turn.user_id) {
            // console.log("I have tu ignore the clicked. Please select a Player");
            return;
        }

        if (
            gameFinish ||
            newMove.status == "Winner" ||
            newMove.status == "Quit" ||
            newMove.status == "Tie" ||
            newMove.status == "TimeUp"
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
            // console.log("Message to send the server:", msg);

            socket.emit("played-move", msg);
        }
    }
    function backToGame() {
        if (gameFinish) {
            dispatch(clearPlayingGame());
        }
        navigate("/");
    }

    return (
        <>
            <div className="tic-tac-toe-game">
                <div className="tic-tact-toe-message">
                    {/* <pre>{JSON.stringify(newMove)}</pre> */}
                    {/* <p>{console.log(turn)}</p> */}
                    {message && (
                        <>
                            <h3>{message}</h3>
                        </>
                    )}
                    {playingGame && (
                        <CountDown
                            room_name={gameInfo.room_name}
                            game_name={gameInfo.game_name}
                            setFinishGame={setGameFinish}
                            isGameFinish={gameFinish}
                            myTurn={myTurn}
                        />
                    )}
                </div>

                <div className="tic-tac-toe-board">
                    <button
                        className={`cell cell-right cell-bottom `}
                        key={0}
                        value={board[0]}
                        onClick={() => clickedHandle(0)}
                    >
                        <p className={`${cellStyle[0] ? "winnerClass" : ""} `}>
                            {board[0]}
                        </p>
                    </button>
                    <button
                        className={`cell cell-left cell-right cell-bottom `}
                        key={1}
                        value={board[1]}
                        onClick={() => clickedHandle(1)}
                    >
                        <p className={`${cellStyle[1] ? "winnerClass" : ""} `}>
                            {board[1]}
                        </p>
                    </button>
                    <button
                        className={`cell cell-left cell-bottom  `}
                        key={2}
                        value={board[2]}
                        onClick={() => clickedHandle(2)}
                    >
                        <p className={`${cellStyle[2] ? "winnerClass" : ""} `}>
                            {board[2]}
                        </p>
                    </button>
                    <button
                        className={`cell  cell-right cell-bottom cell-top `}
                        key={3}
                        value={board[3]}
                        onClick={() => clickedHandle(3)}
                    >
                        <p className={`${cellStyle[3] ? "winnerClass" : ""} `}>
                            {board[3]}
                        </p>
                    </button>
                    <button
                        className={`cell cell-left  cell-right cell-bottom cell-top  `}
                        key={4}
                        value={board[4]}
                        onClick={() => clickedHandle(4)}
                    >
                        <p className={`${cellStyle[4] ? "winnerClass" : ""} `}>
                            {board[4]}
                        </p>
                    </button>
                    <button
                        className={`cell cell-left cell-top cell-bottom  `}
                        key={5}
                        value={board[5]}
                        onClick={() => clickedHandle(5)}
                    >
                        <p className={`${cellStyle[5] ? "winnerClass" : ""} `}>
                            {board[5]}
                        </p>
                    </button>
                    <button
                        className={`cell cell-right cell-top `}
                        key={6}
                        value={board[6]}
                        onClick={() => clickedHandle(6)}
                    >
                        <p className={`${cellStyle[6] ? "winnerClass" : ""} `}>
                            {board[6]}
                        </p>
                    </button>
                    <button
                        className={`cell cell-right cell-left cell-top  `}
                        key={7}
                        value={board[7]}
                        onClick={() => clickedHandle(7)}
                    >
                        <p className={`${cellStyle[7] ? "winnerClass" : ""} `}>
                            {board[7]}
                        </p>
                    </button>
                    <button
                        className={`cell cell-left cell-top  `}
                        key={8}
                        value={board[8]}
                        onClick={() => clickedHandle(8)}
                    >
                        <p className={`${cellStyle[8] ? "winnerClass" : ""} `}>
                            {board[8]}
                        </p>
                    </button>
                </div>
            </div>

            <button className="cancel-game" onClick={backToGame}>
                {buttonName}
            </button>
        </>
    );
}
