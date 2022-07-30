interface ActionType {
    type: string;
    payload: { status: boolean };
}

// typeof ProfileInfoWBio
export default function displayOnlineUserReducer(
    displayOnlineUsers: boolean = false,
    action: ActionType
) {
    if (action.type === "/displayOnlineUsers/setStatus") {
        displayOnlineUsers = action.payload.status;

        // action.payload
        //     ? (displayOnlineUsers = action.payload.status as boolean)
        //     : (displayOnlineUsers = false);
    }

    return displayOnlineUsers;
}

/* -------------------------------------------------------------------------------------------
                                    ACTION
----------------------------------------------------------------------------------------------*/
export function setDisplayOnlineUsers(status: boolean) {
    return {
        type: "/displayOnlineUsers/setStatus",
        payload: { status },
    };
}

export function clearDisplayOnlineUsers() {
    return {
        type: "/displayOnlineUsers/setStatus",
        payload: { status: false },
    };
}
