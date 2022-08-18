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
    saveGameWin,
    saveGameTie,
    getCantWinnerMatches,
    getCantTieMatches,
    getCantTotalMatches,
} from "./db";

// @ts-ignore
// import animals from "animals";
const animals = require("animals");

/* -----------------------------------------------------------------------
                               GENERAL USE
-------------------------------------------------------------------------*/

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

function capitalizeFirstLetter(string: string): string {
    string = string.replace(/\s\s+/g, " ").trim();
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function getMatchInfoByUse(userId: number) {
    return Promise.all([
        getCantWinnerMatches(userId),
        getCantTieMatches(userId),
        getCantTotalMatches(userId),
    ])
        .then((result) => {
            console.log("results[0]", result[0].rows);
            console.log("results[1]", result[1].rows);
            console.log("results[2]", result[2].rows);

            let newResult = [];
            newResult.push(result[0].rows[0]);
            newResult.push(result[1].rows[0]);
            newResult.push(result[2].rows[0]);

            newResult = newResult.map((each) => {
                for (let key in each) {
                    return {
                        match: capitalizeFirstLetter(key),
                        cant: Number.parseInt(each[key]),
                    };
                }
            });

            const totalLost =
                newResult[2].cant - (newResult[1].cant + newResult[0].cant);

            const lost = {
                match: "Lost",
                cant: totalLost,
            };
            newResult.splice(newResult.length - 1, 0, lost);
            console.log("newResult", newResult);

            return newResult;
        })
        .catch((error) => {
            console.log("Error in getMatchInfoByUse ", error);
            return false;
        });
}

/* -----------------------------------------------------------------------
                               GAME LOGIC
-------------------------------------------------------------------------*/

/* -----------------------------------------------------------------------
                               TIC TAC TOC
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
        // Every time I go to a new colum, I rest
        counter = 0;
        winnerArray = [];
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
    nextStep += septForward;

    if (nextStep < 0 || nextStep > board.length) {
        console.log("Next step out of board:", nextStep);
        return false;
    }

    console.log("\t-------------------------------");
    console.log(
        `nextStep: ${nextStep}\t stepForward: ${septForward}, \tnextColumn: ${nextColumn}, \tcounter: ${counter} \ncolumnsLimits[nextColumn + 1]:${
            columnsLimits[nextColumn + 1]
        } \t(nextColumn + 1) >= columnsLimits.length ${
            nextColumn + 1 >= columnsLimits.length
        }`
    );

    if (
        nextColumn + 1 >= columnsLimits.length ||
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

            console.log(
                `\tCurrentPlayer: ${turn}\n\tCurrent Column: ${currentColumn}\n\tNext Column:${nextColumn}`
            );

            console.log(
                `\tCurrentPos: ${nextDiagPosition}\n\tstepForward: ${
                    cantColumns - 1
                }, counter: ${counter}`
            );

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
            counter = 1;
            winnerArray.push(nextDiagPosition);

            console.log(
                `nextStep: ${nextDiagPosition}\n stepForward: ${
                    cantColumns - 1
                }, nextColumn: ${nextColumn}, counter: ${counter}`
            );
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
        return true;
    } else {
        return false;
    }
}

export function analyzePlayedTicTacToe(board: TicTacToeType, turn: number) {
    const columnsLimitsTicTacToe = [0, 3, 6, 9];
    console.log("----------------------------------------------------------");
    console.log(board[0], "\t|", board[1], "\t|", board[2]);
    console.log(board[3], "\t|", board[4], "\t|", board[5]);
    console.log(board[6], "\t|", board[7], "\t|", board[8]);

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

export function calculateWinner(board: TicTacToeType, turn: number) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    console.log("turn", turn);
    console.log("Board", board);
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        console.log();
        console.log(`a: ${a}\tB: ${b}\tc: ${c}\t`);
        console.log(
            `board[a] ${board[a]}\t board[b] ${board[b]}\tboard[c] ${board[c]}`
        );
        console.log(
            "board[a] == turn && board[b] == turn && board[c] == turn",
            board[a] == turn && board[b] == turn && board[c] == turn
        );
        if (board[a] == turn && board[b] == turn && board[c] == turn) {
            winnerArray.push(a);
            winnerArray.push(b);
            winnerArray.push(c);

            return true;
        }
    }
    return false;
}

// export function analyzePlayedTicTacToe(board: TicTacToeType, turn: number) {
//     console.log("----------------------------------------------------------");
//     winnerArray = [];
//     console.log("winnerArray when we enter the validation", winnerArray);
//     if (calculateWinner(board, turn)) {
//         console.log("winnerArray", winnerArray);
//         return { status: "Winner", winnerArray };
//     }

//     const emptyResult = checkingEmptySpaces(board);
//     console.log("emptyResult", emptyResult);

//     if (!emptyResult) {
//         return { status: "Tie" };
//     }
//     return { status: "Turn" };
// }

const GamesDictionary = {
    tictactoe: 1,
};

export function saveGame(
    status: string,
    playerA_id: number,
    playerB_id: number,
    gameName: string,
    winner_id: number
) {
    // [field as keyof typeof someObj]
    const gameId = GamesDictionary[gameName as keyof typeof GamesDictionary];
    if (status == "Winner") {
        let ptsA = 0,
            ptsB = 0;
        playerA_id == winner_id ? (ptsA = 3) : (ptsB = 3);

        saveGameWin(
            playerA_id,
            playerB_id,
            gameId,
            winner_id,
            ptsA,
            ptsB
        ).catch((err) => console.log("Error Saving Winner", err));
    } else {
        saveGameTie(playerA_id, playerB_id, gameId).catch((err) =>
            console.log("Error Saving tie:", err)
        );
    }
}
