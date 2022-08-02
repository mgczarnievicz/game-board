import React, { useEffect, useState } from "react";
import "./App.css";
import "./general.css";

import { Link, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";

import { userSetUser } from "./redux/user/slice";
import TicTacToe from "./tictactoe/tictactoe";
import Games from "./games";
import { RootState } from "./redux/reducer";
import { UserAlias, InviteMsg } from "./typesClient";
import Profile from "./profile/profile";
import DisplayOnlineUsers from "./DisplayOnlineUsers/displayOnlineUsers";
import { clearDisplayOnlineUsers } from "./redux/displayOnlineUser/slice";
import Invite from "./Invite/invite";
import ProfilePhoto from "./profile/profilePhoto";
import PointsTable from "./PointsTable/PointsTable";
import EditProfile from "./EditProfile/EditProfile";

library.add(faBars, faX);
// import Registration from "./registration";

function App() {
    const dispatch = useDispatch();
    const userInfo: UserAlias = useSelector((state: RootState) => state.user);
    const showOnlineUsers: boolean = useSelector(
        (state: RootState) => state.displayOnlineUsers
    );

    const receivedInvite: InviteMsg | null = useSelector(
        (state: RootState) => state.receivedInvite
    );
    const playingGame: boolean = useSelector(
        (state: RootState) => state.playingGame
    );

    const [showMenu, setShowMenu] = useState(false);

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

    function toggleMenu() {
        if (!playingGame) setShowMenu(!showMenu);
    }
    function logOutFunction() {
        toggleMenu();
        fetch("/api/logout")
            .then((resp) => resp.json())
            .then((data) => {
                if (data.status === "Success") {
                    // eslint-disable-next-line no-restricted-globals
                    location.reload();
                }
            });
    }

    function goToClicked() {
        toggleMenu();
        dispatch(clearDisplayOnlineUsers());
    }

    function goToGameBoard() {
        toggleMenu();
        // If I go to gameBoard I abandon the game I was Playing.
        dispatch(clearDisplayOnlineUsers());
    }
    return (
        <div className="App">
            {/* <BrowserRouter> */}
            <header className="App-header">
                {userInfo && (
                    <div className="user-img">
                        {/* <ProfilePhoto user={userInfo} /> */}
                        <Profile user={userInfo} />
                    </div>
                )}
                <nav className="big-screen">
                    {!playingGame && (
                        <>
                            <Link to="/" onClick={goToGameBoard}>
                                Games
                            </Link>
                            <Link to="/points" onClick={goToClicked}>
                                Points
                            </Link>
                            <Link to="/myProfile" onClick={goToClicked}>
                                My Profile
                            </Link>

                            <Link to="/" onClick={logOutFunction}>
                                Log Out
                            </Link>
                        </>
                    )}
                </nav>
                <nav className="small-screen " onClick={toggleMenu}>
                    <FontAwesomeIcon icon="bars" size="sm" color="white" />
                </nav>
            </header>

            <div
                className={`small-screen-menu ${
                    showMenu
                        ? "small-screen-menu-moveIn"
                        : "small-screen-menu-vanish"
                } `}
            >
                <div onClick={toggleMenu} className="close-menu">
                    <FontAwesomeIcon icon="x" />
                </div>
                <Link to="/" onClick={goToGameBoard}>
                    Games
                </Link>
                <Link to="/points" onClick={goToClicked}>
                    Points
                </Link>
                <Link to="/myProfile" onClick={goToClicked}>
                    My Profile
                </Link>

                <Link to="/" onClick={logOutFunction}>
                    Log Out
                </Link>
            </div>

            {showOnlineUsers && !playingGame && <DisplayOnlineUsers />}
            {receivedInvite && <Invite />}

            <Routes>
                <Route path="/" element={<Games />}></Route>
                <Route path="/tictactoe" element={<TicTacToe />}></Route>
                <Route path="/points" element={<PointsTable />}></Route>
                <Route path="/myProfile" element={<EditProfile />}></Route>
            </Routes>
            {/* </BrowserRouter> */}

            {/* <header className="App-header">
                <p>WellCome to my App</p>
                <Link to="/" onClick={logOutFunction}>
                    Log Out
                </Link>
            </header> */}
        </div>
    );
}

export default App;
