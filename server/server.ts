import express, { Express, Request, NextFunction, Response } from "express";
import path from "path";
import cookieSession from "cookie-session";

import { QueryResult } from "pg";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import {
    UserRegistration,
    LogInUser,
    UserAlias,
    MsgPlayedMove,
    BasicCommMsg,
} from "./typesServer";

import {
    registerNewUser,
    getUserInfo,
    logInVerify,
    analyzePlayedTicTacToe,
    saveGame,
    getMatchInfoByUse,
} from "./process";

import { getInfoOnlineUsers, getPointsTable, updateImage } from "./db";

const PORT = 8080;
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req: Request, callback: Function) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

// Bc we are deploying we need to define where to get the value.
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets").COOKIE_SECRET;

const cookieSessionMiddleware = cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 15,
    sameSite: true,
});

io.use((socket: Socket, next: NextFunction) => {
    cookieSessionMiddleware(
        socket.request as Request,
        (socket.request as Request).res,
        next
    );
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieSessionMiddleware);

app.use((req, res, next) => {
    console.log("---------------------");
    console.log("req.url:", req.url);
    console.log("req.method:", req.method);
    console.log("req.session:", req.session);
    console.log("req.body:", req.body);
    console.log("---------------------");
    next();
});

app.get("/api/logout", (req, res) => {
    console.log(
        `---------------------------------------------------------------------\n\t Log out`
    );
    req.session = null;
    res.json({
        status: "Success",
    });
});

app.get("/api/user/id", function (req, res) {
    console.log(
        `---------------------------------------------------------------------\n\t Get User Id`
    );
    res.json({
        status: "Success",
        userId: req.session && req.session.userId,
    });
});

/* ---------------------------------------------------------------------------------------
                                REGISTRATION
--------------------------------------------------------------------------------------- */

app.post("/api/registration", (req, res) => {
    console.log(
        `---------------------------------------------------------------------\n\t Registration Info:`,
        req.body
    );
    // Lets Register!
    registerNewUser(req.body)
        .then((currentUser: UserAlias | boolean) => {
            // console.log(
            //     "currentUser:",
            //     currentUser,
            //     "\ntypeof currentUser:",
            //     typeof currentUser
            // );
            if (typeof currentUser != "boolean") {
                if (req.session) req.session.userId = currentUser.user_id;
                res.json({
                    status: "Success",
                });
            } else {
                res.json({
                    status: "Error",
                });
            }
        })
        .catch((err: QueryResult) => {
            res.json({
                status: "Error",
            });
        });
});

/* ---------------------------------------------------------------------------------------
                                LOG IN
--------------------------------------------------------------------------------------- */
app.post("/api/login", (req, res) => {
    console.log(
        `---------------------------------------------------------------------\n\t Log In:`,
        req.body
    );

    logInVerify(req.body)
        .then((userLogIn: boolean | LogInUser) => {
            // console.log("logInVerify Response, userLogIn:", userLogIn);
            if (typeof userLogIn === "boolean") {
                res.json({
                    status: "Error",
                });
            } else {
                // console.log("userLogIn not a boolean");
                if (req.session) req.session.userId = userLogIn.id;
                res.json({
                    status: "Success",
                });
            }
        })
        .catch((err: QueryResult) => {
            console.log("Error in log In", err);
            res.json({
                status: "Error",
            });
        });
});

/* ---------------------------------------------------------------------------------------
                       GET USER INFO AFTER REGISTRATION & LOGIN
--------------------------------------------------------------------------------------- */
app.get("/api/getUserInfo", (req, res) => {
    // console.log(
    //     `------------------------------------------------------------------\n\t Get User Info`
    // );
    getUserInfo(req.session.userId).then((data: UserAlias | boolean) => {
        // console.log("Data from getUserInfo", data);
        if (typeof data != "boolean") {
            res.json({
                status: "Success",
                payload: data,
            });
        } else {
            res.json({
                status: "Error",
            });
        }
    });
});

/* ---------------------------------------------------------------------------------------
                       GET POINTS TABLE
--------------------------------------------------------------------------------------- */

app.get("/api/getPointsTable", (req, res) => {
    // Get data  from in points table.
    getPointsTable()
        .then((result: QueryResult) => {
            console.log("Points Table query", result.rows);
            res.json({
                status: "Success",
                payload: result.rows,
            });
        })
        .catch((err: QueryResult) => {
            console.log("Error in Points Table", err);
            res.json({
                status: "Error",
            });
        });
});

app.get("/api/getMatchInfo", (req, res) => {
    getMatchInfoByUse(req.session.userId).then((data: [] | boolean) => {
        console.log("Data from getUserInfo", data);
        if (typeof data != "boolean") {
            res.json({
                status: "Success",
                payload: data,
            });
        } else {
            res.json({
                status: "Error",
            });
        }
    });
});

/* ---------------------------------------------------------------------------------------
                       UPDATE IMAGE PROFILE TABLE
--------------------------------------------------------------------------------------- */

app.post("/api/updateImage", (req, res) => {
    console.log(
        `---------------------------------------------------------------------\n\t Update Img:`,
        req.body
    );
    // Get data  from in points table.
    updateImage(req.session.userId, req.body.image_url)
        .then((result: QueryResult) => {
            console.log("Update Image query", result.rows);
            res.json({
                status: "Success",
                payload: result.rows[0],
            });
        })
        .catch((err: QueryResult) => {
            console.log("Error in Points Table", err);
            res.json({
                status: "Error",
            });
        });
});

/* ---------------------------------------------------------------------------------------
                                ALWAYS IN THE END!
--------------------------------------------------------------------------------------- */

// app.listen(process.env.PORT || PORT, function () {
//     console.log(`server started at http://localhost:${PORT}`);
// });

server.listen(process.env.PORT || PORT, function () {
    console.log(`server started at http://localhost:${PORT}`);
});

/* -------------------------------------------------------------------------------
                                    SOCKET 
---------------------------------------------------------------------------------*/

/*  Explanation of the types:
because our middleware we know that the socket have a request, and this request knows from above that it will have a 
cookie session, so we need to tell that the request from socket is the type of Request (Express) (SocketWithSession)
*/
interface SocketWithSession extends Socket {
    request: Request;
}

/* For maintain a list of online Users */
interface UserOnline {
    [key: number]: Array<string>;
}
// UsersOnlineInfo;
const userOnline: UserOnline = {};

/* 
const CONNECT_4_GAMES = {
    "23ldfs0l": {
        players: [{id:7, player: 1}, {id: 11, player: 2}]
        state: [
            [0, 0, 1, 0, 2, 0],
            [0, 0, 1, 0, 2, 0],
            [0, 0, 1, 0, 2, 0],
            [0, 0, 1, 0, 2, 0],
            [1, 0, 1, 0, 2, 0],
        ]
    }
}

UserPlaying{
    id: number,
    player:number 1|2
}

game = {
    players: Array<>
    ticTacToe_Board = [[],[],[]]
}
*/

/*........................................................................... 
                            GAMES TYPES
...........................................................................*/
type TicTacToeType = Array<1 | 2 | null>;

type GameType = TicTacToeType;

interface Game {
    players: Array<{ id: number; player: 1 | 2 }>;
    game: string;
    state: GameType;
}

interface BoardsType {
    [key: string]: Game;
}
const Boards: BoardsType = {};

// REVIEW See how to do the players dynamic 1 or 2
const initGame: Game = {
    players: [
        { id: null, player: 1 },
        { id: null, player: 2 },
    ],
    game: "",
    state: null,
};

interface InviteMsg {
    to: UserAlias;
    from: UserAlias;
    game_name: string;
    room_name?: string;
}

io.on("connection", function (socket: SocketWithSession) {
    if (!socket.request.session.userId) {
        // Here I have to go through my userSocket and delete the connection.
        // userSocket[];
        return socket.disconnect(true);
    }

    const InfoOnlineUsers = async () => {
        const onlineUsers = Object.keys(userOnline);
        try {
            // console.log("listOnlineUsers", onlineUsers);
            const resp: QueryResult = await getInfoOnlineUsers(onlineUsers);
            // console.log("InfoOnlineUsers", resp.rows);
            io.emit("online-users", resp.rows);
        } catch (err) {
            console.log("Error InfoOnlineUsers", err);
        }
    };

    const userId = socket.request.session.userId;
    console.log(
        "----------------------------------------------------------------------"
    );
    console.log(
        `User with the id: ${userId} and socket id ${socket.id} just connected.`
    );

    /* ----------------------------------------------------
    Keeping Track Online Users
    -------------------------------------------------------*/

    socket.on("disconnect", () => {
        userOnline[userId].filter((eachSocket: string) => {
            eachSocket != socket.id;
        });

        if (userOnline[userId]) {
            delete userOnline[userId];
        }

        // Notify the disconnection.
        InfoOnlineUsers();
    });

    if (userOnline[userId]) {
        // There is already the key.
        userOnline[userId].push(socket.id);
    } else {
        // Fist Time connecting.
        userOnline[userId] = [socket.id];
    }
    InfoOnlineUsers();
    console.log("Mi list of connection", userOnline);

    /* ----------------------------------------------------
                    Play Games - 2 player
    -------------------------------------------------------*/
    socket.on("send-invite-to-play", (inviteMsg: InviteMsg) => {
        const roomName = inviteMsg.from.alias + inviteMsg.to.alias;
        inviteMsg.room_name = roomName;
        console.log(
            "------------------------------------------------\n",
            "You invited other User to play. set the room name\n",
            inviteMsg
        );

        userOnline[inviteMsg.to.user_id].map((eachSocket) => {
            io.to(eachSocket).emit("received-invite-to-play", inviteMsg);
        });
    });

    socket.on("accept-invite-to-play", (inviteMsg: InviteMsg) => {
        console.log(
            "------------------------------------------------\n",
            "The other player accepted my invite.\n",
            inviteMsg
        );
        // we join the room.
        const roomName = inviteMsg.room_name;
        // to -> is the one responding
        socket.join(roomName);

        // The other Player Socket to join the room
        userOnline[inviteMsg.from.user_id].map((eachSocket) => {
            // io.to(eachSocket).emit("received-invite-to-play", inviteMsg);
            // FIXME!!!!!!!
            io.to(eachSocket).emit("invite-accepted-join-room", inviteMsg);
        });
    });

    interface PlayerInf extends UserAlias {
        symbol: string;
        player: 1 | 2;
    }
    interface StartGameMsg {
        game_name: string;
        room_name: string;
        player1: PlayerInf;
        player2: PlayerInf;
    }

    socket.on("invite-accepted-join-room", (inviteMsg: InviteMsg) => {
        console.log(
            "------------------------------------------------\n",
            "invite-accepted-join-room, inviteMsg:\n",
            inviteMsg
        );
        const roomName = inviteMsg.room_name;
        Boards[roomName] = initGame;
        Boards[roomName].players[0].id = inviteMsg.from.user_id;

        Boards[roomName].players[1].id = inviteMsg.to.user_id;

        Boards[roomName].game = inviteMsg.game_name;
        Boards[roomName].state = [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        ];

        console.log("INIT BOARD\n", Boards);

        const message: StartGameMsg = {
            game_name: inviteMsg.game_name,
            room_name: inviteMsg.room_name,
            player1: { ...inviteMsg.from, symbol: "X", player: 1 },
            player2: { ...inviteMsg.to, symbol: "O", player: 2 },
        };

        // console.log("roomName", roomName);
        socket.join(roomName);
        // console.log("socket.rooms", socket.rooms);
        io.to(roomName).emit("start-game", message);
    });

    socket.on("played-move", (playedMove: MsgPlayedMove) => {
        let newMove: 1 | 2;
        playedMove.played_user_id === Boards[playedMove.room_name].players[0].id
            ? (newMove = Boards[playedMove.room_name].players[0].player)
            : (newMove = Boards[playedMove.room_name].players[1].player);

        Boards[playedMove.room_name].state[playedMove.index] = newMove;

        // Lets see if there is a Winner!
        console.log(
            "------------------------------------------------\n",
            "Board with the new move\n",
            Boards[playedMove.room_name].state
        );
        const { status, winnerArray } = analyzePlayedTicTacToe(
            Boards[playedMove.room_name].state,
            newMove
        );

        playedMove.status = status as "Turn" | "Quit" | "Winner" | "Tie";

        if (status == "Winner") {
            playedMove.winnerArray = winnerArray;
        }
        console.log("analyzePlayedTicTacToe:", status);
        if (status == "Winner" || status == "Tie") {
            saveGame(
                status,
                Boards[playedMove.room_name].players[0].id,
                Boards[playedMove.room_name].players[1].id,
                Boards[playedMove.room_name].game,
                playedMove.played_user_id
            );
            Boards[playedMove.room_name].state = [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ];
            console.log("log Boards After Winner or Tie", Boards);
        }
        //I should here see the state of the game.
        io.to(playedMove.room_name).emit("played-move", playedMove);
    });

    socket.on("game-ended", (finishMsg: BasicCommMsg) => {
        console.log("game-ended");
        socket.leave(finishMsg.room_name);
        delete Boards[finishMsg.room_name];
        console.log("log Boards After Deleting", Boards);
    });

    socket.on("quite-game", (quiteMsg: BasicCommMsg) => {
        console.log(
            "------------------------------------------------\n",
            "One player QUITE a GAME. Notify the other Player",
            quiteMsg
        );
        saveGame(
            "Quite",
            Boards[quiteMsg.room_name].players[0].id,
            Boards[quiteMsg.room_name].players[1].id,
            Boards[quiteMsg.room_name].game,
            null
        );
        socket.leave(quiteMsg.room_name);
        const response = {
            game_name: quiteMsg.game_name,
            room_name: quiteMsg.room_name,
            played_user_id: userId,
            status: "Quit",
        };
        Boards[quiteMsg.room_name].state = [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        ];
        console.log("log Boards after quite-game", Boards);
        io.to(quiteMsg.room_name).emit("quite-game", response);
    });

    socket.on("received-quite-game", (quiteMsg: BasicCommMsg) => {
        console.log(
            "------------------------------------------------\n",
            "RECEIVED player QUITE a GAME. Notify the other Player",
            quiteMsg
        );
        socket.leave(quiteMsg.room_name);
        delete Boards[quiteMsg.room_name];

        console.log(
            "------------------------------------------------\n",
            "Lets see the games that are on after received quiteGame!\n",
            Boards
        );
    });

    socket.on("reject-invite-to-play", (inviteMsg: InviteMsg) => {
        console.log(
            "------------------------------------------------\n",
            "The other player REJECT my invite. Let the other Player KNOW",
            inviteMsg
        );
    });

    socket.on("tic-tac-toe-msg", (userIdToChat: number) => {
        console.log("BEFORE DB newest-privetMsg-chat", userIdToChat);
        // getMessage(userId, userIdToChat).then((result: Array<{}> | boolean) => {
        //     console.log("IN newest-message-chat", result);
        //     if (result) {
        //         //I send it back to whom it asked.
        //         socket.emit("chat-newest-message", result);
        //     }
        // });
    });
});
