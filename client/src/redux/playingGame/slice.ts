interface ActionType {
    type: string;
    payload: { status: boolean };
}

// typeof ProfileInfoWBio
export default function playingGameReducer(
    playingGame: boolean = false,
    action: ActionType
) {
    if (action.type === "/playingGame/setStatus") {
        playingGame = action.payload.status;

        // action.payload
        //     ? (displayOnlineUsers = action.payload.status as boolean)
        //     : (displayOnlineUsers = false);
    }

    return playingGame;
}

/* -------------------------------------------------------------------------------------------
                                    ACTION
----------------------------------------------------------------------------------------------*/
export function setPlayingGame(status: boolean) {
    return {
        type: "/playingGame/setStatus",
        payload: { status },
    };
}
