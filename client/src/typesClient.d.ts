export interface UserAlias {
    user_id: number;
    alias: string;
    image_url: string;
}

export interface TictactoeType {
    turn: UserAlias;
    winner?: UserAlias | null;
}

export interface InviteMsg {
    to: UserAlias;
    from: UserAlias;
    game_name: string;
}
