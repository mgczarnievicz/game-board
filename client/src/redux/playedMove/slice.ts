import { PlayedMove } from "../../typesClient";
interface ActionType {
    type: string;
    payload: PlayedMove;
}

const initPlayedMove: PlayedMove = {
    index: 0,
    played_user_id: 0,
    status: "Turn",
    status_user_id: 0,
    winnerArray: null,
};

// typeof ProfileInfoWBio
export default function playedMoveReducer(
    playedMoveState: PlayedMove = initPlayedMove,
    action: ActionType
) {
    if (action.type === "/playedMove/newMove") {
        // console.log("action.payload", action.payload);
        playedMoveState = action.payload;
    }

    return playedMoveState;
}

/* -------------------------------------------------------------------------------------------
                                    ACTION
----------------------------------------------------------------------------------------------*/
export function ticTacToeNextTurn(nextP: PlayedMove) {
    return {
        type: `/playedMove/newMove`,
        payload: nextP,
    };
}

export function clearPlayedMove() {
    return {
        type: `/playedMove/newMove`,
        payload: initPlayedMove,
    };
}
