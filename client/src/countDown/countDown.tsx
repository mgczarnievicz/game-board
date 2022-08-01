import React from "react";
import ReactDOM from "react-dom";
import Countdown from "react-countdown";
import { socket } from "../socket";

interface CountDownProps {
    room_name: string;
    game_name: string;
    setFinishGame: Function;
    isGameFinish: boolean;
}

export default function CountDown(props: CountDownProps) {
    // Random component
    const Completionist = () => <span>Time's Up!</span>;

    // Renderer callback with condition
    // @ts-ignore comment.
    const renderer = ({ hours, minutes, seconds, completed, api }) => {
        if (completed) {
            // Render a complete state
            /* when this happens  we loose our turn so we loos the game. Its like we " quit" the game.
            I need to send:
                game_name
                room_name
                
             */
            props.setFinishGame(true);
            socket.emit("quite-game", {
                room_name: props.room_name,
                game_name: props.game_name,
            });

            return <Completionist />;
        } else {
            if (props.isGameFinish) {
                api.stop();
            }
            // Render a countdown
            return (
                <span>
                    {minutes}:{seconds}
                </span>
            );
        }
    };

    // ReactDOM.render(
    //     <Countdown date={Date.now() + 5000} renderer={renderer} />,
    //     document.getElementById("root")
    // );

    return (
        <>
            <Countdown date={Date.now() + 10000} renderer={renderer} />,
        </>
    );
}
