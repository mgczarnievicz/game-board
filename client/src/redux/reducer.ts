import { combineReducers } from "redux";
import userReducer from "./user/slice";
import tictactoeReducer from "./tictactoe/slice";
import onlineUsersReducer from "./usersOnline/slice";
import displayOnlineUserReducer from "./displayOnlineUser/slice";
import playingGameReducer from "./playingGame/slice";
import receivedInviteReducer from "./receivedInvite/slice";

const rootReducer = combineReducers({
    user: userReducer,
    tictactoe: tictactoeReducer,
    onlineUsers: onlineUsersReducer,
    displayOnlineUsers: displayOnlineUserReducer,
    playingGame: playingGameReducer,
    receivedInvite: receivedInviteReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
