import React, { useEffect } from "react";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { userSetUser } from "./redux/user/slice";
import TicTacToe from "./tictactoe/tictactoe";
import Games from "./games";
import { RootState } from "./redux/reducer";
import { UserAlias } from "./typesClient";
import Profile from "./profile/profile";
import DisplayOnlineUsers from "./DisplayOnlineUsers/displayOnlineUsers";

// import Registration from "./registration";

function App() {
    const dispatch = useDispatch();
    const userInfo: UserAlias = useSelector((state: RootState) => state.user);
    const showOnlineUsers: boolean = useSelector(
        (state: RootState) => state.displayOnlineUsers
    );

    useEffect(() => {
        (async () => {
            let abort = false;
            try {
                // handle fetch success
                const respBody = await fetch("/api/getUserInfo");
                const data = await respBody.json();
                console.log("Data from /api/getUserInfo", data);

                if (!abort) {
                    return dispatch(userSetUser(data.payload));
                } else {
                    console.log("ignore don't run a a state update");
                }
            } catch (err) {
                // handle fetch failure
                console.log("Error", err);
            }

            return () => {
                abort = true;
            };
        })();
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
                {userInfo && (
                    <>
                        <Profile user={userInfo} />
                    </>
                )}
                <nav>
                    <Link to="/">Games</Link>
                    <Link to="/friends">Points</Link>
                    <Link to="/chat">Chat</Link>

                    <Link to="/" onClick={logOutFunction}>
                        Log Out
                    </Link>
                </nav>
            </header>

            {showOnlineUsers && <DisplayOnlineUsers />}

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
