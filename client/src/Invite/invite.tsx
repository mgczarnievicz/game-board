import React from "react";
import { useSelector } from "react-redux";
import Profile from "../profile/profile";
import { RootState } from "../redux/reducer";
import { InviteMsg } from "../typesClient";

export default function Invite() {
    const receivedInvite: InviteMsg | null = useSelector(
        (state: RootState) => state.receivedInvite
    );
    console.log("Log Invite in Invite:", receivedInvite);

    return (
        <>
            {receivedInvite && (
                <>
                    <pre>{JSON.stringify(receivedInvite)}</pre>

                    <h3>
                        Your received and Invite! Form:{" "}
                        {/* {receivedInvite.from.alias}{" "} */}
                    </h3>
                    {/* <Profile user={receivedInvite?.from} /> */}
                    <p>to play!</p>
                    <div>
                        <button>Accept</button>
                        <button>Reject</button>
                    </div>
                </>
            )}
        </>
    );
}
