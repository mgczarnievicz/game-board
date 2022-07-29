import express, { Express, Request, NextFunction, Response } from "express";
import path from "path";
import cookieSession from "cookie-session";

import { QueryResult } from "pg";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import { UserRegistration, LogInUser, UserAlias } from "./typesServer";

import { registerNewUser, getUserInfo, logInVerify } from "./process";

import { getInfoOnlineUsers } from "./db";

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
        `-----------------------------------------------------------------------------\n\t Log out`
    );
    req.session = null;
    res.json({
        status: "Success",
    });
});

app.get("/api/user/id", function (req, res) {
    console.log(
        `-----------------------------------------------------------------------------\n\t Get User Id`
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
        `-----------------------------------------------------------------------------\n\t Registration Info:`,
        req.body
    );
    // Lets Register!
    registerNewUser(req.body)
        .then((currentUser: UserAlias | boolean) => {
            console.log(
                "currentUser:",
                currentUser,
                "\ntypeof currentUser:",
                typeof currentUser
            );
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
        `-----------------------------------------------------------------------------\n\t Log In:`,
        req.body
    );

    logInVerify(req.body)
        .then((userLogIn: boolean | LogInUser) => {
            console.log("logInVerify Response, userLogIn:", userLogIn);
            if (typeof userLogIn === "boolean") {
                res.json({
                    status: "Error",
                });
            } else {
                console.log("userLogIn not a boolean");
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
    console.log(
        `-----------------------------------------------------------------------------\n\t Get User Info`
    );
    getUserInfo(req.session.userId).then((data: UserAlias | boolean) => {
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
const Boards = {};

interface InviteMsg {
    to: UserAlias;
    from: UserAlias;
    game_name: string;
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
            console.log("listOnlineUsers", onlineUsers);
            const resp: QueryResult = await getInfoOnlineUsers(onlineUsers);
            console.log("InfoOnlineUsers", resp.rows);
            io.emit("online-users", resp.rows);
        } catch (err) {
            console.log("Error InfoOnlineUsers", err);
        }
    };

    const userId = socket.request.session.userId;

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
                    Chat
    -------------------------------------------------------*/
    io.emit("testing-socket");

    socket.on("invitation-to-play", (inviteMsg: InviteMsg) => {
        // Is better to send my info so I can send it to the other user.
        console.log("You invited other User to play.", inviteMsg);

        userOnline[inviteMsg.to.user_id].map((eachSocket) => {
            io.to(eachSocket).emit("accept-invite-to-play", inviteMsg);
        });
    });

    socket.on("accept-invite-to-play", () => {
        console.log(
            "The other player accepted my invite. Create room chat and let know the players to start playing"
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

    // socket.on("invitation-to-play", (invitation) => {
    //     console.log("Invitation received", invitation);
    //     // Here I will have to send a message to the other user. If the user Accept then create the
    //     // room and both users can play.
    // });

    socket.on(
        "chat-new-message",
        (newMsg: { message: string; receiver_id: number }) => {
            console.log("New Message", newMsg);
            // addNewMessage(userId, newMsg).then((result: {} | boolean) => {
            //     console.log("IN generalMsg-new-message", result);
            //     if (result) {
            //         // Here I have to see to whom send it.
            //         if (newMsg.receiver_id) {
            //             //Send it to the specific one
            //             userOnline[newMsg.receiver_id].map((eachSocket) => {
            //                 io.to(eachSocket).emit("chat-new-message", result);
            //             });
            //             socket.emit("chat-new-message", result);
            //         } else {
            //             //General to send
            //             io.emit("chat-new-message", result);
            //         }
            //     }
            // });
        }
    );
});
