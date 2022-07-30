import { StartGameMsg, PlayerInf } from "../../typesClient";

interface ActionType {
    type: string;
    payload: StartGameMsg;
}

const initPlayerInfo: PlayerInf = {
    user_id: 0,
    alias: "",
    image_url: "",
    symbol: "",
    player: null,
};
const initGameMsg: StartGameMsg = {
    game_name: "",
    room_name: "",
    player1: initPlayerInfo,
    player2: initPlayerInfo,
};

// typeof ProfileInfoWBio
export default function gameInfoReducer(
    gameInfo: StartGameMsg = initGameMsg,
    action: ActionType
) {
    if (action.type === "/newGame/setGame") {
        gameInfo = action.payload;
    }

    return gameInfo;
}

/* -------------------------------------------------------------------------------------------
                                    ACTION
----------------------------------------------------------------------------------------------*/
export function setNewGame(gameInfo: StartGameMsg) {
    return {
        type: `/newGame/setGame`,
        payload: gameInfo,
    };
}
