import Registration from "./registration";
import LogIn from "./login";
// import ResetPassword from "./resetPassword";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";

export default function Welcome() {
    return (
        <div id="main-welcome">
            <div className="image-welcome">
                {/* <img src="/HorseMan pink.png" /> */}
            </div>
            <BrowserRouter>
                <div className="access-welcome">
                    <Routes>
                        <Route path="/" element={<Registration />}></Route>
                        <Route path="/login" element={<LogIn />}></Route>
                        {/* <Route path="/resetPassword">
                        <ResetPassword />
                    </Route> */}
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}
