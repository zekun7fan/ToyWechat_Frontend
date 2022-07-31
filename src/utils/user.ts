import {baseURL} from "../net/http";

export const user_token_key = "token"
export const user_id_key = "id"




export function getUserId(): string | null {
    const uid: string | null = sessionStorage.getItem(user_id_key);
    return uid !== null ? uid : null;
}


export function getUserToken(): string | null {
    return sessionStorage.getItem(user_token_key);
}



export function getPictureUrl(url: string) : string {
    return `${baseURL}/user_service/${url}`
}


//
//
// export function getUserInfo(): User | null{
//     const id = localStorage.getItem(user_id_key)
//     if (id == null){
//         return  null;
//     }
//     return {
//         id: parseInt(id),
//         name: localStorage.getItem(user_name_key) as string,
//         type: parseInt(localStorage.getItem(user_type_key) as string),
//     }
// }
//
