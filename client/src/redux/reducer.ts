import { combineReducers } from "redux";
import userReducer from "./user/slice";
import tictactoeReducer from "./tictactoe/slice";
import onlineUsersReducer from "./usersOnline/slice";
import displayOnlineUserReducer from "./displayOnlineUser/slice";

const rootReducer = combineReducers({
    user: userReducer,
    tictactoe: tictactoeReducer,
    onlineUsers: onlineUsersReducer,
    displayOnlineUsers: displayOnlineUserReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
