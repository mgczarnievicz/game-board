import path from "path";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NewProfileImage from "../newProfileImage/NewProfileImage";
import ProfilePhoto from "../profile/profilePhoto";
import { RootState } from "../redux/reducer";
import { UserAlias } from "../typesClient";

import "./EditProfile.css";
import "../general.css";

interface MyMatches {
    match: string;
    cant: number;
}

export default function EditProfile() {
    const myUser: UserAlias = useSelector((state: RootState) => state.user);
    const [toggle, setToggle] = useState(false);
    const [arrayPoints, setArrayPoints] = useState<Array<MyMatches>>([]);

    useEffect(() => {
        (async () => {
            let abort = false;
            try {
                // handle fetch success
                const respBody = await fetch("/api/getMatchInfo");
                const data = await respBody.json();
                console.log("Data from /api/getMatchInfo", data);

                if (!abort) {
                    return setArrayPoints(data.payload);
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

    function closeImage() {
        setToggle(false);
    }
    return (
        <>
            <div className="edit-profile-container">
                <h1>My Profile</h1>
                <div className="profile-info">
                    <div onClick={() => setToggle(!toggle)}>
                        <ProfilePhoto user={myUser} />
                    </div>
                    <h2>{myUser.alias}</h2>
                </div>
                <div className="points-table-container">
                    <h3>My Matches</h3>
                    <table className="points-table matches-table">
                        <th>Result</th>
                        <th>Total Points</th>
                        <tbody>
                            {arrayPoints &&
                                arrayPoints.length != 0 &&
                                arrayPoints.map((each: MyMatches) => {
                                    return (
                                        <>
                                            <tr>
                                                <td
                                                    className="table-line"
                                                    colSpan={2}
                                                ></td>
                                            </tr>

                                            <tr>
                                                <td className="matches-cell">
                                                    <p>{each.match}</p>
                                                </td>

                                                <td className="total-cell">
                                                    <p>{each.cant}</p>
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
            {toggle && <NewProfileImage closeImage={closeImage} />}
        </>
    );
}
