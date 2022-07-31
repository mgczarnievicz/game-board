export interface UserRegistration {
    name: string;
    surname: string;
    email: string;
    password: string;
}

export interface UserAlias {
    user_id: number;
    alias: string;
    image_url: string;
}

export interface LogInUser {
    id?: number;
    email: string;
    password: string;
}

export type TicTacToeType = Array<number>;

export type GameType = TicTacToeType;

interface BasicCommMsg {
    game_name: string;
    room_name: string;
}
export interface PlayedMove {
    index: number;
    played_user_id: number;
    status: "Turn" | "Quit" | "Winner" | "Tie";
    status_user_id: number;
}
export interface MsgPlayedMove extends BasicCommMsg, PlayedMove {}
