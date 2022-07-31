import {baseURL} from "../net/http";

export const user_token_key = "token"
export const user_id_key = "id"


export function getUserId(): string | null {
    const uid: string | null = sessionStorage.getItem(user_id_key);
    return uid !== null ? uid : null;
}



export function getPictureUrl(url: string) : string {
    return `${baseURL}/user_service/${url}`
}


