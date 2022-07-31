const spicedPg = require("spiced-pg");
import { QueryResult } from "pg";

let USER_NAME, USER_PASSWORD;
if (!process.env.DATABASE_URL) {
    // Bc we are deploying we need to define where to get the value.
    USER_NAME = require("./secrets").USER_NAME;
    USER_PASSWORD = require("./secrets").USER_PASSWORD;
}

const database = "gameBoard";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${USER_NAME}:${USER_PASSWORD}@localhost:5432/${database}`
);

import { UserRegistration, UserAlias } from "./typesServer";

/* ---------------------------------------------------------------
                    users TABLE
----------------------------------------------------------------*/

export function registerUser(
    name: string,
    surname: string,
    email: string,
    password: string
): Promise<QueryResult> {
    const q = `INSERT INTO users (name, surname, email, password, active)
    VALUES ($1, $2, $3, $4, true ) RETURNING id`;

    const param = [name, surname, email, password];
    return db.query(q, param);
}

// If the user is not register it will return an empty array
//<UserLoggingIn | null>
export function getUserByEmail(email: string): Promise<QueryResult<UserAlias>> {
    return db.query(
        `SELECT id, email, password FROM users
            WHERE users.email = $1 AND active=true;`,
        [email]
    );
}

/* ---------------------------------------------------------------
                        profile TABLE
----------------------------------------------------------------*/

export function saveProfile(
    user_id: number,
    alias: string
): Promise<QueryResult<UserAlias>> {
    const q = `INSERT INTO profile (user_id, alias, image_url)
    VALUES ($1, $2, null) RETURNING user_id, alias,image_url`;

    const param = [user_id, alias];
    return db.query(q, param);
}

export function getProfileByUserId(
    userId: number
): Promise<QueryResult<UserAlias>> {
    const q = `SELECT user_id, alias, image_url FROM profile
    WHERE user_id= $1`;

    const param = [userId];
    return db.query(q, param);
}

export function getInfoOnlineUsers(
    ids: Array<string>
): Promise<QueryResult<UserAlias>> {
    return db.query(
        `SELECT id, user_id, alias, image_url FROM profile 
        WHERE user_id=ANY($1);`,
        [ids]
    );
}

// export { registerUser, getUserByEmail };
/* ---------------------------------------------------------------
                        games TABLE
----------------------------------------------------------------*/
export function saveGameWin(
    playerA_id: number,
    playerB_id: number,
    gameId: number,
    winner_id: number,
    playerA_pts: number,
    playerB_pts: number
): Promise<QueryResult<UserAlias>> {
    console.log(
        ` playerA_id ${playerA_id},  playerB_id${playerB_id}, gameId ${gameId} winner_id ${winner_id}`
    );
    const q = `INSERT INTO games (player_A_id, player_B_id, game_id, winner_id, player_A_pts, player_B_pts)
    VALUES ($1, $2, $3, $4, $5, $6 )`;

    const param = [
        playerA_id,
        playerB_id,
        gameId,
        winner_id,
        playerA_pts,
        playerB_pts,
    ];
    return db.query(q, param);
}

export function saveGameTie(
    playerA_id: number,
    playerB_id: number,
    gameId: number
): Promise<QueryResult<UserAlias>> {
    console.log(
        ` playerA_id ${playerA_id},  playerB_id${playerB_id}, gameId ${gameId}`
    );
    const q = `INSERT INTO games (player_A_id, player_B_id, game_id, winner_id, player_A_pts, player_B_pts)
    VALUES ($1, $2, $3, null, 1, 1 )`;

    const param = [playerA_id, playerB_id, gameId];
    return db.query(q, param);
}

export function getPointsTable(): Promise<QueryResult> {
    const q = `WITH all_games AS (
	SELECT player_a_id AS player, game_id, SUM(player_A_pts) AS points
	FROM games
	GROUP BY player_a_id, game_id
	UNION ALL
	SELECT player_b_id AS player, game_id, SUM(player_B_pts)
	FROM games
	GROUP BY player_b_id, game_id
)
SELECT all_games.player, profile.alias, profile.image_url, all_games.game_id, SUM(points) AS points 
FROM all_games
LEFT JOIN profile
ON all_games.player = profile.user_id
GROUP BY all_games.player, profile.alias, profile.image_url, all_games.game_id`;

    return db.query(q, []);
}
