import { combineReducers } from "redux";
import userReducer from "./user/slice";
import tictactoeReducer from "./tictactoe/slice";

const rootReducer = combineReducers({
    user: userReducer,
    tictactoe: tictactoeReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
