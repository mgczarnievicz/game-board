export interface UserAlias {
    user_id: number;
    alias: string;
    image_url: string;
}

export interface TictactoeType {
    turn: UserAlias;
    winner?: UserAlias | null;
}

interface BasicCommMsg {
    game_name: string;
    room_name: string;
}
export interface InviteMsg extends BasicCommMsg {
    to: UserAlias;
    from: UserAlias;
}

export interface PlayerInf extends UserAlias {
    symbol: string;
    player: 1 | 2 | null;
}
export interface StartGameMsg extends BasicCommMsg {
    player1: PlayerInf;
    player2: PlayerInf;
}

export interface PlayedMove {
    col: number;
    row: number;
    played_user_id: number;
}
export interface MsgPlayedMove extends BasicCommMsg, PlayedMove {}
