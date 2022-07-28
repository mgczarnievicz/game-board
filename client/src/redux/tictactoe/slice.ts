import { UserAlias, TictactoeType } from "./../../typesClient";

interface ActionType {
    type: string;
    payload: TictactoeType;
}

const initUser: UserAlias = {
    user_id: 0,
    alias: "",
    image_url: "",
};

const initTtTStatus: TictactoeType = {
    turn: initUser,
};

// typeof ProfileInfoWBio
export default function tictactoeReducer(
    tictactoeState: TictactoeType = initTtTStatus,
    action: ActionType
) {
    if (action.type === "/ticTacToe/player") {
        console.log("action.payload", action.payload);
        tictactoeState = { ...tictactoeState, ...action.payload };

        action.payload
            ? (tictactoeState = action.payload as TictactoeType)
            : (tictactoeState = initTtTStatus);
    }
    // switch (action.type) {
    //     case "/ticTacToe/player":
    //         console.log("action.payload", action.payload);
    //         tictactoeState = { ...tictactoeState, ...action.payload };

    //         action.payload
    //             ? (tictactoeState = action.payload as TictactoeType)
    //             : (tictactoeState = initTtTStatus);
    //         break;
    //     default:
    //         break;
    // }
    return tictactoeState;
}

/* -------------------------------------------------------------------------------------------
                                    ACTION
----------------------------------------------------------------------------------------------*/
export function ticTacToeNextTurn(nextP: TictactoeType) {
    return {
        type: `/ticTacToe/player`,
        payload: nextP,
    };
}
