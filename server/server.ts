import express from "express";
import path from "path";
import cookieSession from "cookie-session";

import { UserRegistration, LogInUser, UserAlias } from "./typesServer";

import { QueryResult } from "pg";
import { registerNewUser, getUserInfo, logInVerify } from "./process";

const app = express();
const PORT = 8080;

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

app.listen(process.env.PORT || PORT, function () {
    console.log(`server started at http://localhost:${PORT}`);
});
