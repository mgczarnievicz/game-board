import express from "express";
import path from "path";

const app = express();
const PORT = 8080;

import cookieSession from "cookie-session";

// Bc we are deploying we need to define where to get the value.
const COOKIE_SECRET = "Solo por ahora";
// const COOKIE_SECRET =
//     process.env.COOKIE_SECRET || require("./secrets").COOKIE_SECRET;

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

app.post("/api/registration", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Registration Info:`,
        req.body
    );
    res.json({
        status: "Error",
    });
});

/* ---------------------------------------------------------------------------------------
                                ALWAYS IN THE END!
--------------------------------------------------------------------------------------- */

app.listen(process.env.PORT || PORT, function () {
    console.log(`server started at http://localhost:${PORT}`);
});
