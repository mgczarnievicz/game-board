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
        `SELECT profile.user_id, profile.alias, profile.image_url FROM profile
            INNER JOIN users
            ON profile.user_id = users.id
            WHERE users.email = $1;`,
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

// export { registerUser, getUserByEmail };
