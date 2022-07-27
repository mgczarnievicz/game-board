import express from "express";
import path from "path";

import { UserRegistration, LogInUser, UserAlias } from "./typesServer";

import { QueryResult } from "pg";
import { registerNewUser } from "./process";

const app = express();
const PORT = 8080;

import cookieSession from "cookie-session";

// Bc we are deploying we need to define where to get the value.
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets").COOKIE_SECRET;

const cookieSessionMiddleware = cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 15,
    sameSite: true,
});

app.use(express.json());
app.use(express.urlencoded());

app.use((req, res, next) => {
    console.log("---------------------");
    console.log("req.url:", req.url);
    console.log("req.method:", req.method);
    console.log("req.session:", req.session);
    console.log("req.body:", req.body);
    console.log("---------------------");
    next();
});

app.get("/test", (req, res) => {
    console.log("Testing");
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
        userId: req.session && req.session.userId,
    });
});

app.post("/api/registration", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Registration Info:`,
        req.body
    );
    // Lets Register!
    registerNewUser(req.body)
        .then((currentUser: UserAlias | boolean) => {
            console.log("currentUser:", currentUser);
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
                                ALWAYS IN THE END!
--------------------------------------------------------------------------------------- */

app.listen(process.env.PORT || PORT, function () {
    console.log(`server started at http://localhost:${PORT}`);
});
