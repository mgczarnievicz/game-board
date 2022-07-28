import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./redux/reducer";

import { UserAlias } from "./typesClient";
import Profile from "./profile/profile";
import { socket } from "./socket";

import "./displayOnlineUsers.css";

export default function DisplayOnlineUsers() {
    const myUser: UserAlias = useSelector((state: RootState) => state.user);
    const userOnline: Array<UserAlias> = useSelector(
        (state: RootState) => state.onlineUsers
    );

    function selectedUserToPlay(userId: number) {
        console.log("I clicked in an online User:", userId);

        // socket.emit("invitation", {
        //     to: userId,
        //     from: myUser,
        // });
    }

    return (
        <div className="display-online-users">
            {userOnline &&
                userOnline.map((each: UserAlias) => {
                    return (
                        <div
                            onClick={() => {
                                selectedUserToPlay(each.user_id);
                            }}
                        >
                            <Profile user={each} key={each.user_id} />
                        </div>
                    );
                })}
        </div>
    );
}
