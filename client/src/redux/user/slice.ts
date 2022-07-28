// import { Action, Dispatch } from "redux";
// import { ThunkAction } from "redux-thunk";
// import { RootState } from "./../reducer";

import { UserAlias } from "./../../typesClient";

interface ActionType {
    type: string;
    payload: Partial<UserAlias>;
}

const initUser: UserAlias = {
    user_id: 0,
    alias: "",
    image_url: "",
};

// typeof ProfileInfoWBio
export default function userReducer(
    user: UserAlias = initUser,
    action: ActionType
) {
    switch (action.type) {
        case "/userInfo/receive":
            console.log("action.payload", action.payload);
            user = { ...user, ...action.payload };

            action.payload
                ? (user = action.payload as UserAlias)
                : (user = initUser);
            break;
        case "/userInfo/updatePhotoUrl":
            // user = { ...user, image_url: action.payload.image_url };
            break;
        case "/userInfo/updateBio":
            // user = { ...user, bio: action.payload.bio };
            break;
        default:
            break;
    }
    return user;
}

/* -------------------------------------------------------------------------------------------
                                    ACTION
----------------------------------------------------------------------------------------------*/
export function userSetUser(user: UserAlias) {
    return {
        type: `/userInfo/receive`,
        payload: user,
    };
}

export function userUpdatePhotoUrl(image_url: string) {
    return {
        type: `/userInfo/updatePhotoUrl`,
        payload: { image_url },
    };
}

export function userUpdateBio(bio: Array<string>) {
    return {
        type: `/userInfo/updateBio`,
        payload: { bio },
    };
}
