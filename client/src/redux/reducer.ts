import { combineReducers } from "redux";
import userReducer from "./user/slice";
import playedMoveReducer from "./playedMove/slice";
import onlineUsersReducer from "./usersOnline/slice";
import displayOnlineUserReducer from "./displayOnlineUser/slice";
import playingGameReducer from "./playingGame/slice";
import receivedInviteReducer from "./receivedInvite/slice";
import gameInfoReducer from "./gameInfo/slice";

const rootReducer = combineReducers({
    user: userReducer,
    onlineUsers: onlineUsersReducer,
    displayOnlineUsers: displayOnlineUserReducer,
    playingGame: playingGameReducer,
    receivedInvite: receivedInviteReducer,
    playedMove: playedMoveReducer,
    gameInfo: gameInfoReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
