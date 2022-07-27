import express from "express";
import path from "path";

const app = express();
const PORT = 8080;

/* ---------------------------------------------------------------------------------------
                                ALLWAY IN THE END!
--------------------------------------------------------------------------------------- */
app.get("/test", (req, res) => {
    console.log("Testing");
});

// app.get("*", function (req, res) {
//     res.sendFile(path.join(__dirname, "..", "client", "index.html"));
// });

app.listen(process.env.PORT || PORT, function () {
    console.log(`server started at http://localhost:${PORT}`);
});
