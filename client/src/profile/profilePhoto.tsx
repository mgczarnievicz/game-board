import React from "react";

import { UserAlias } from "../typesClient";

interface PropsProfile {
    user: UserAlias;
}

export default function ProfilePhoto(props: PropsProfile) {
    return (
        <>
            <img
                src={props.user.image_url || require("../img/Oso.png")}
                alt={props.user.alias}
            ></img>
        </>
    );
}
