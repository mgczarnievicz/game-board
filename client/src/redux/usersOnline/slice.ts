import { UserAlias } from "./../../typesClient";

interface ActionType {
    type: string;
    payload: { usersOnline: Array<UserAlias> };
}

export default function onlineUsersReducer(
    onlineUsers: Array<UserAlias> = [],
    action: ActionType
) {
    switch (action.type) {
        case "usersOnline/update":
            console.log("IN usersOnline/update");
            onlineUsers = action.payload.usersOnline;
            break;
        default:
            break;
    }
    return onlineUsers;
}

export function usersOnlineUpdate(listUsers: Array<UserAlias>) {
    return {
        type: "usersOnline/update",
        payload: { usersOnline: listUsers },
    };
}
