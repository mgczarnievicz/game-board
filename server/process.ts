import { QueryResult } from "pg"; //This bc I need the type there.

import * as encryption from "./encryption";

import { UserRegistration, LogInUser, UserAlias } from "./typesServer";

import {
    registerUser,
    saveProfile,
    getUserByEmail,
    getProfileByUserId,
} from "./db";

// @ts-ignore
// import animals from "animals";
const animals = require("animals");

/* -----------------------------------------------------------------------
                               GENERAL USE
-------------------------------------------------------------------------*/
// NO VA ACA. Iría en el cliente
const IMG_DICTIONARY = {
    1: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Arrdilla.png",
    2: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Camello.png",
    3: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Conejo.png",
    4: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Elefante.png",
    5: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Oso.png",
    6: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Pajaro.png",
    7: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Pato.png",
    8: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Perro.png",
    9: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Perro1.png",
    10: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Perro2.png",
    11: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Perro3.png",
    12: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Rinoceronte.png",
    13: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Zorro.png",
    14: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Zorro1.png",
    15: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/racoon.png",
    16: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Loro2.png",
    17: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Loro.png",
    18: "https://imageboard-cy.s3.eu-central-1.amazonaws.com/boardGames/Elefante2.png",
};

const DATE_OPTION = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
};

// type T = NewUserRegistration | LogInUser | UserResetPassword;
type T = UserRegistration | LogInUser;

function cleanEmptySpaces<T>(obj: T): T {
    let result: T = { ...obj };
    Object.entries(obj).forEach(([key, value]) => {
        result[key as keyof typeof obj] = value.replace(/\s\s+/g, " ").trim();
    });

    return result;
}

/* -----------------------------------------------------------------------
                               REGISTRATION
-------------------------------------------------------------------------*/
function saveNewUserAndGenerateAlias(
    newUser: UserRegistration
): Promise<UserAlias | boolean> {
    return registerUser(
        newUser.name,
        newUser.surname,
        newUser.email.toLowerCase(),
        newUser.password
    )
        .then((dbResult: QueryResult) => {
            const user_id = dbResult.rows[0].id;
            const alias = animals();
            // console.log("Alias", alias, "\nuser_id", user_id);
            return saveProfile(user_id, alias + "_" + user_id)
                .then((result: QueryResult<UserAlias>) => result.rows[0])
                .catch((err: QueryResult) => {
                    console.log("Err", err);
                    return false;
                });
        })
        .catch((err: QueryResult) => {
            console.log("Error in registerUser", err);
            return false;
        });
}

export function registerNewUser(
    newUser: UserRegistration
): Promise<boolean | UserAlias> {
    // First hash the pass.
    // then write in db.
    // console.log("In registerNewUser", newUser);
    return encryption
        .hash(newUser.password)
        .then((hashPass: string) => {
            const cleanNewUser: UserRegistration =
                cleanEmptySpaces<UserRegistration>(newUser);
            cleanNewUser.password = hashPass;

            return saveNewUserAndGenerateAlias(cleanNewUser);
        })
        .catch((hashErr: QueryResult) => {
            console.log("Error in registerNewUser", hashErr);
            return false;
        });
}

/* -----------------------------------------------------------------------
                              LOG IN
-------------------------------------------------------------------------*/
export function logInVerify(
    userLogIn: LogInUser
): Promise<LogInUser | boolean> {
    userLogIn = cleanEmptySpaces<LogInUser>(userLogIn);
    console.log();
    return getUserByEmail(userLogIn.email.toLowerCase())
        .then((result: QueryResult) => {
            // See what we recived and if there is a result, then se if its empty or not.
            if (result.rows.length === 0) {
                console.log("Email not register");
                return false;
            }
            return encryption
                .compare(userLogIn.password, result.rows[0].password)
                .catch((err: QueryResult) => err)
                .then((isCorrect: boolean) => {
                    if (isCorrect) {
                        console.log("You Are In!");
                        return result.rows[0];
                    } else {
                        return false;
                    }
                });
        })
        .catch((err: QueryResult) => err);
}

/* -----------------------------------------------------------------------
                               GET USER INFO
-------------------------------------------------------------------------*/
export function getUserInfo(userId: number): Promise<boolean | UserAlias> {
    console.log("Process GetUser Info id", userId);
    return getProfileByUserId(userId)
        .then((result: QueryResult) => {
            console.log("getUserInfo result.rows", result.rows);
            return result.rows[0];
        })
        .catch((err: QueryResult) => {
            console.log("Error in getUserInfo", err);
            return false;
        });
}
