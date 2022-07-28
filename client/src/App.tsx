import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { asyncReceiveUser } from "./redux/user/slice";
import TicTacToe from "./tictactoe/tictactoe";
import Games from "./games";

// import Registration from "./registration";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        let abort = false;
        // FIXME TYPeSCRIPT ERROR
        // dispatch(asyncReceiveUser(abort));
        return () => {
            abort = true;
        };
    }, []);

    function logOutFunction() {
        fetch("/api/logout")
            .then((resp) => resp.json())
            .then((data) => {
                if (data.status === "Success") {
                    // eslint-disable-next-line no-restricted-globals
                    location.reload();
                }
            });
    }
    return (
        <div className="App">
            {/* <BrowserRouter> */}
            <header className="App-header">
                <nav>
                    <Link to="/">Games</Link>
                    <Link to="/friends">Friends</Link>
                    <Link to="/chat">Chat</Link>

                    <Link to="/" onClick={logOutFunction}>
                        Log Out
                    </Link>
                </nav>
            </header>

            <Routes>
                <Route path="/" element={<Games />}></Route>
                <Route path="/tictactoe" element={<TicTacToe />}></Route>
            </Routes>
            {/* </BrowserRouter> */}

            {/* <header className="App-header">
                <p>WellCome to my App</p>
                <Link to="/" onClick={logOutFunction}>
                    Log Out
                </Link>
            </header> */}
            <h1> Your ARE LOGIN!!!! :D</h1>
        </div>
    );
}

export default App;
