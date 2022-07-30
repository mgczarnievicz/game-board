import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducer";

import { UserAlias } from "../typesClient";
import Profile from "../profile/profile";
import { socket } from "../socket";

import "./displayOnlineUsers.css";

export default function DisplayOnlineUsers() {
    const myUser: UserAlias = useSelector((state: RootState) => state.user);
    // const userOnline: Array<UserAlias> = useSelector(
    //     (state: RootState) => state.onlineUsers
    // );

    const userOnline: Array<UserAlias> = useSelector((state: RootState) =>
        state.onlineUsers?.filter((each) => each.user_id !== state.user.user_id)
    );

    function selectedUserToPlay(otherUser: UserAlias) {
        console.log("I clicked in an online User:", otherUser);

        socket.emit("send-invite-to-play", {
            to: otherUser,
            from: myUser,
            game_name: "tictactoe",
        });
    }

    return (
        <div className="display-online-users">
            {userOnline.length == 0 && (
                <>
                    <h1>There is No other Player Connected.</h1>
                    <br />
                    <h2>Play a Solo Game </h2>
                </>
            )}
            {userOnline &&
                userOnline.map((each: UserAlias) => {
                    return (
                        <div
                            onClick={() => {
                                selectedUserToPlay(each);
                            }}
                            key={each.user_id}
                        >
                            <Profile user={each} />
                        </div>
                    );
                })}
        </div>
    );
}
