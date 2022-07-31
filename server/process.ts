import { QueryResult } from "pg"; //This bc I need the type there.

import * as encryption from "./encryption";

import {
    UserRegistration,
    LogInUser,
    UserAlias,
    TicTacToeType,
} from "./typesServer";

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
    // console.log("Process GetUser Info id", userId);
    return getProfileByUserId(userId)
        .then((result: QueryResult) => {
            // console.log("getUserInfo result.rows", result.rows);
            return result.rows[0];
        })
        .catch((err: QueryResult) => {
            console.log("Error in getUserInfo", err);
            return false;
        });
}

/* -----------------------------------------------------------------------
                               GAME LOGIC
-------------------------------------------------------------------------*/

// NEED TO BE GLOBAL TO BE ABLE TO SAVE THE VALUES!
let winnerArray: Array<number> = [];

function horizontalVictory(
    numConnectedWin: number,
    board: TicTacToeType,
    turn: number,
    columnsLimits: Array<number>
) {
    let counter: number = 0;
    let currentColumn = 0;
    winnerArray = [];

    for (let i = 0; i < board.length; i++) {
        // console.log(
        //     "board[i]",
        //     board[i],
        //     "\ti",
        //     i,
        //     "\tturn",
        //     turn,
        //     "\tcolumnsLimits[currentColumn + 1]",
        //     columnsLimits[currentColumn + 1]
        // );
        if (i >= columnsLimits[currentColumn + 1]) {
            // Keeping track in which column I am in.
            //Next column, reset values
            currentColumn++;
            winnerArray = [];
            counter = 0;
        }
        if (board[i] == turn) {
            winnerArray.push(i);
            counter++;
        } else {
            counter = 0;
            winnerArray = [];
        }

        if (counter === numConnectedWin) {
            console.log("WINNER!!\thorizontalVictory\t", winnerArray);
            return true;
        }
    }

    console.log("No WINNER\thorizontalVictory");
    /* We return an boolean, true is there is a winner and false otherwise */
    return false;
}

function verticalVictory(
    numConnectedWin: number,
    board: TicTacToeType,
    turn: number,
    cantColumns: number
) {
    let counter: number = 0;
    winnerArray = [];

    for (let i = 0; i < cantColumns; i++) {
        for (let j = i; j < board.length; j += cantColumns) {
            // console.log(
            //     "board[j]",
            //     board[j],
            //     "\tj",
            //     j,
            //     "\tturn",
            //     turn,
            //     "\tboard[j] == turn",
            //     board[j] == turn
            // );
            if (board[j] == turn) {
                winnerArray.push(j);
                counter++;
            } else {
                counter = 0;
                winnerArray = [];
            }

            if (counter === numConnectedWin) {
                console.log("WINNER!!\tverticalVictory", winnerArray);
                return true;
            }
        }
    }

    console.log("No WINNER\tverticalVictory");
    /* We return an boolean, true is there is a winner and false otherwise */
    return false;
}

function nextPositionDiagonal(
    nextStep: number,
    septForward: number,
    board: TicTacToeType,
    turn: number,
    nextColumn: number,
    counter: number,
    columnsLimits: Array<number>,
    numConnectedWin: number
): boolean {
    nextStep -= septForward;

    // console.log(
    //     `nextStep: ${nextStep}\n stepForward: ${septForward}, nextColumn: ${nextColumn}, counter: ${counter}`
    // );

    if (
        nextStep >= columnsLimits[nextColumn + 1] ||
        (board[nextStep] != turn && counter !== numConnectedWin)
    ) {
        // I am NOT in  the next column or the slot has not my current player color.
        return false;
    }
    counter++;
    nextColumn++;
    winnerArray.push(nextStep);

    if (counter === numConnectedWin) {
        return true;
    }

    return nextPositionDiagonal(
        nextStep,
        septForward,
        board,
        turn,
        nextColumn,
        counter,
        columnsLimits,
        numConnectedWin
    );
}

function diagonalVictory(
    numConnectedWin: number,
    board: TicTacToeType,
    turn: number,
    cantColumns: number,
    columnsLimits: Array<number>
) {
    /* 
        +4 -> be careful that they are un the next column the next value.
        +2 -> be careful that they are in the nest column.
        */

    let counter: number = 0;
    let currentColumn = 0;

    let nextColumn = 0;
    let found = false;
    let nextDiagPosition = 0;
    winnerArray = [];

    for (let i = 0; i < board.length; i++) {
        // First time founding a slot of the current Player.
        if (board[i] == turn) {
            // Reset values for the diagonal Search
            winnerArray = [];
            nextDiagPosition = i;

            // Save the column where the slot was found, this is for limits reasons.
            nextColumn = currentColumn + 1;
            counter++;
            winnerArray.push(nextDiagPosition);

            // console.log(
            //     `\tCurrentPlayer: ${turn}\n\tCurrent Column: ${currentColumn}\n\tNext Column:${nextColumn}`
            // );
            // console.log(
            //     `\tCurrentPos: ${nextDiagPosition}\n\tstepForward: ${
            //         cantColumns - 1
            //     }, counter: ${counter}`
            // );

            // Search in one diagonal. -2
            /*         /
                     /
                   /     From left to right */

            found = nextPositionDiagonal(
                nextDiagPosition,
                cantColumns - 1,
                board,
                turn,
                nextColumn,
                counter,
                columnsLimits,
                numConnectedWin
            );
            console.log("Return value of nextPosition (-2)", found);
            if (found) {
                console.log("winnerSlots (-2)", winnerArray);
                return true;
            }

            /*  \
                 \
                  \    From right to left */
            winnerArray = [];
            winnerArray.push(nextDiagPosition);

            // console.log(
            //     `nextStep: ${nextDiagPosition}\n stepForward: ${
            //         cantColumns - 1
            //     }, nextColumn: ${nextColumn}, counter: ${counter}`
            // );
            found = nextPositionDiagonal(
                nextDiagPosition,
                cantColumns + 1,
                board,
                turn,
                nextColumn,
                counter,
                columnsLimits,
                numConnectedWin
            );
            console.log("Return value od nextPosition (-4)", found);
            if (found) {
                console.log("winnerSlots (-4)", winnerArray);
                return true;
            }
        }
        counter = 0;

        if (i >= columnsLimits[currentColumn + 1]) {
            // Keeping track in which column I am in
            currentColumn++;
        }
    }
}

function checkingEmptySpaces(board: TicTacToeType) {
    let emptySpaces: number = 0;
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            emptySpaces++;
        }
    }
    if (emptySpaces) {
        return "Turn";
    } else {
        return "Tie";
    }
}

export function analyzePlayedTicTacToe(board: TicTacToeType, turn: number) {
    const columnsLimitsTicTacToe = [0, 3, 6, 9];
    console.log("----------------------------------------------------------");

    if (
        horizontalVictory(3, board, turn, columnsLimitsTicTacToe) ||
        verticalVictory(3, board, turn, 3) ||
        diagonalVictory(3, board, turn, 3, columnsLimitsTicTacToe)
    ) {
        console.log("winnerArray", winnerArray);
        return { status: "Winner", winnerArray };
    }

    const emptyResult = checkingEmptySpaces(board);
    console.log("emptyResult", emptyResult);

    if (!emptyResult) {
        return { status: "Tie" };
    }
    return { status: "Turn" };
}
