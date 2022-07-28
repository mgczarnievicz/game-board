export interface UserAlias {
    user_id: number;
    alias: string;
    image_url: string;
}

export interface TictactoeType {
    turn: UserAlias;
    winner?: UserAlias | null;
}
