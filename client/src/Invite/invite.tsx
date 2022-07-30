import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../profile/profile";
import { RootState } from "../redux/reducer";
import { socket } from "../socket";
import { InviteMsg } from "../typesClient";
import { clearReceivedInvite } from "../redux/receivedInvite/slice";
import { setPlayingGame } from "../redux/playingGame/slice";

import "./invite.css";
import { useNavigate } from "react-router-dom";

export default function Invite() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const receivedInvite: InviteMsg | null = useSelector(
        (state: RootState) => state.receivedInvite
    );
    console.log("Log Invite in Invite:", receivedInvite);

    function buttonHandle(action: string) {
        if (action === "Accept") {
            // Accept game
            console.log("Accept");
            socket.emit("accept-invite-to-play", receivedInvite);
            dispatch(setPlayingGame());
            // REVIEW! I CAN USE NAVIGATE!
            // eslint-disable-next-line no-restricted-globals
            // location.replace(`/${receivedInvite?.game_name}`);
            navigate(`/${receivedInvite?.game_name}`);
        } else {
            //Reject game.
            console.log("Reject");
            socket.emit("reject-invite-to-play", receivedInvite);
        }
        dispatch(clearReceivedInvite());
    }

    return (
        <>
            {receivedInvite && (
                <div className="invitation">
                    {/* <pre>{JSON.stringify(receivedInvite)}</pre> */}

                    <h3>
                        Your received and Invite to play:
                        {receivedInvite.game_name} from
                    </h3>
                    <Profile user={receivedInvite?.from} />

                    <div className="invitation-button">
                        <button onClick={() => buttonHandle("Accept")}>
                            Accept
                        </button>
                        <button onClick={() => buttonHandle("Reject")}>
                            Reject
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
