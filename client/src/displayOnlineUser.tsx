import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./redux/reducer";

import { UserAlias } from "./typesClient";
import Profile from "./profile/profile";

export default function displayOnlineUser() {
    // FIXME. TYPESCRIPT ERROR
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const userOnline: Array<UserAlias> = useSelector(
        (state: RootState) => state.onlineUsers
    );

    return (
        <>
            {userOnline &&
                userOnline.map((each: UserAlias) => {
                    return <Profile user={each} key={each.user_id} />;
                })}
        </>
    );
}
