import React from "react";
import ReactDOM from "react-dom";
import Countdown from "react-countdown";

export default function CountDown() {
    // Random component
    const Completionist = () => <span>You are good to go!</span>;

    // Renderer callback with condition
    // @ts-ignore comment.
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a complete state
            return <Completionist />;
        } else {
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
            <Countdown date={Date.now() + 5000} renderer={renderer} />,
        </>
    );
}
