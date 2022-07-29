import { InviteMsg } from "./../../typesClient";

interface ActionType {
    type: string;
    payload: InviteMsg;
}

export default function receivedInviteReducer(
    receivedInvite: InviteMsg | null = null,
    action: ActionType
) {
    if (action.type === "/receivedInvite/setStatus") {
        receivedInvite = { ...receivedInvite, ...action.payload };

        // action.payload
        //     ? (receivedInvite = action.payload as InviteMsg)
        //     : (receivedInvite = null);
        // receivedInvite = action.payload;
    }

    if (action.type === "/receivedInvite/clearStatus") {
        receivedInvite = { ...receivedInvite, ...action.payload };
        receivedInvite = null;
        // action.payload
        //     ? (receivedInvite = action.payload as InviteMsg)
        //     : (receivedInvite = null);
        // receivedInvite = action.payload;
    }

    return receivedInvite;
}

/* -------------------------------------------------------------------------------------------
                                    ACTION
----------------------------------------------------------------------------------------------*/
export function setReceivedInvite(invite: InviteMsg) {
    return {
        type: "/receivedInvite/setStatus",
        payload: invite,
    };
}

export function clearReceivedInvite() {
    return {
        type: "/receivedInvite/clearStatus",
        payload: { invite: null },
    };
}
