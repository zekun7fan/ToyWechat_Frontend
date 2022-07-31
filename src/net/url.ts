export const user_url = `/user_service/user`

export const message_url = `/message_service/message`


export const conditional_message_url = `/message_service/conditional_message`


export const request_url = `/request_service/request`


export const login_url = `/user_service/toLogin`

export const register_url = `/user_service/toRegister`


export const logout_url = `/user_service/toLogout`


export const friend_visibility_url = `/friend_service/friend_visibility`


export const relation_url = `/friend_service/relation`


export const post_visibility_url = `/friend_service/post_visibility`


export function friend_url(uid: string) {
    return `/friend_service/${uid}/friend`

}


export function comment_url(pid: string) {
    return `/post_comment_service/${pid}/comment`
}


export function content_url(uid: string) {
    return `/post_content_service/${uid}/postContent`
}


export function post_like_url(pid: string) {
    return `/post_like_service/${pid}/postLike`
}


export function discovery_url(uid: string) {
    return `/post_content_service/${uid}/discovery`
}


export function userById(uid: string) {
    return `/user_service/${uid}/background`
}


export function visible_friend_url(uid: string) {
    return `/friend_service/${uid}/visible_friends`
}


export function friend_info_url(uid: string) {
    return `/friend_service/${uid}/friend_info`
}






