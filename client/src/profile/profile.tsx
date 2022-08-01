import React from "react";
import "./profile.css";

import { UserAlias } from "../typesClient";
import ProfilePhoto from "./profilePhoto";

interface PropsProfile {
    user: UserAlias;
}

export default function Profile(props: PropsProfile) {
    console.log("Props in Profile:", props);

    return (
        <div className="profile">
            <img
                src={props.user.image_url || require("../img/Oso.png")}
                alt={props.user.alias}
            ></img>
            <h3>{props.user.alias}</h3>
        </div>
    );
}
