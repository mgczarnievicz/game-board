import React, { useEffect, useState } from "react";
import "./pointsTable.css";

interface UserPoints {
    alias: string;
    game_id: number;
    image_url: string;
    points: string;
    player: number;
}

export default function PointsTable() {
    const [arrayPoints, setArrayPoints] = useState([]);

    useEffect(() => {
        (async () => {
            let abort = false;
            try {
                // handle fetch success
                const respBody = await fetch(`/api/getPointsTable`);
                const data = await respBody.json();
                console.log("Data recived getPointsTable", data);

                if (data.status == "Success") {
                    setArrayPoints(data.payload);
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

    console.log("arrayPoints", arrayPoints);

    return (
        <div className="points-table-container">
            <h3>PointsTable</h3>
            <table className="points-table">
                <th>User</th>

                <th>Total Points</th>

                {arrayPoints.length != 0 &&
                    arrayPoints.map((eachUser: UserPoints) => {
                        return (
                            <>
                                <tr>
                                    <td className="table-line" colSpan={2}></td>
                                </tr>

                                <tr>
                                    <td className="image-alias-cell">
                                        <img
                                            src={
                                                eachUser.image_url ||
                                                require("../img/Oso.png")
                                            }
                                            alt={eachUser.alias}
                                        ></img>
                                        <p>{eachUser.alias}</p>
                                    </td>

                                    <td className="pints-cel">
                                        <p>{eachUser.points}</p>
                                    </td>
                                </tr>
                            </>
                        );
                    })}
            </table>
        </div>
    );
}
