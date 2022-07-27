import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Link, Route } from "react-router-dom";

// import Registration from "./registration";

function App() {
    function logOutFunction() {
        fetch("/logout.json")
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
            <header className="App-header">
                <p>WellCome to my App</p>
                <Link to="/" onClick={logOutFunction}>
                    Log Out
                </Link>
            </header>
            <h1> Your ARE LOGIN!!!! :D</h1>
        </div>
    );
}

export default App;
