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
    }

    return playingGame;
}

/* -------------------------------------------------------------------------------------------
                                    ACTION
----------------------------------------------------------------------------------------------*/
export function setPlayingGame() {
    return {
        type: "/playingGame/setStatus",
        payload: { status: true },
    };
}

export function clearPlayingGame() {
    return {
        type: "/playingGame/setStatus",
        payload: { status: false },
    };
}
