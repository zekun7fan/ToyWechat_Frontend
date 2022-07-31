import {del, get, post, put} from "./http";
import {
    comment_url, conditional_message_url,
    content_url,
    discovery_url, friend_info_url, friend_url, friend_visibility_url,
    login_url, logout_url,
    message_url,
    post_like_url, post_visibility_url, register_url, relation_url,
    request_url,
    user_url, visible_friend_url
} from "./url";
import {Friend, Message, PostComment, PostContent, Request, User} from "./interfaces";


export function getUserById(uid: string) {
    return get('/user_service/user/byid', {uid})
}


export function getUserByEmail(email: string) {
    return get('/user_service/user/byemail', {email})
}


export function sendMessage(message: Message) {
    return post(message_url, {}, message)
}


export function retrieveMessage(uid: string) {
    return get(message_url, {uid})
}


export function addComment(pid: string, comment: PostComment) {
    return post(comment_url(pid), {}, comment)
}


export function deleteComment(pid: string, cid: string) {
    return del(comment_url(pid), {cid})
}

export function getComment(pid: string, id: number) {
    return get(comment_url(pid), {id})
}


export function addPostContent(uid: string, content: PostContent) {
    return post(content_url(uid), {}, content)
}


export function delPostContent(uid: string, pid: string) {
    return del(content_url(uid), {pid})
}


export function getNewPostContent(uid: string, id: number) {
    return get(content_url(uid), {id, dir: 'new'})
}


export function getOldPostContent(uid: string, id: number) {
    return get(content_url(uid), {id, dir: 'old'})
}


export function discoveryNewPostList(uid: string, obj: Object) {
    return post(discovery_url(uid), {dir: 'new'}, obj)
}


export function discoveryOldPostList(uid: string, obj: Object) {
    return post(discovery_url(uid), {dir: 'old'}, obj)
}


export function addPostLike(pid: string, uid: string) {
    return post(post_like_url(pid), {uid: uid})
}


export function delPostLike(pid: string, uid: string) {
    return del(post_like_url(pid), {uid})
}


export function getPostLike(pid: string) {
    return get(post_like_url(pid))
}


export function sendRequest(request: Request) {
    return post(request_url, {}, request)
}


export function handleRequest(request: Request) {
    return put(request_url, {}, request)
}


export function getSentAndPendingRequests(uid: string) {
    return get(request_url, {uid, dir: 0, status: 0})
}


export function getSentAndFinishedRequests(uid: string) {
    return get(request_url, {uid, dir: 0, status: 1})

}


export function getHandledAndPendingRequests(uid: string) {
    return get(request_url, {uid, dir: 1, status: 0})

}


export function getHandledAndFinishedRequests(uid: string) {
    return get(request_url, {uid, dir: 1, status: 1})

}


export function toLogin(user: User) {
    return put(login_url, {}, user)
}


export function toRegister(user: User) {
    return post(register_url, {}, user)
}


export function toLogout(user: User) {
    return del(logout_url, {}, user)
}


export function addFullFriend(uid: string, fid: string) {
    return post(friend_url(uid), {fid, type: 0})

}


export function addHalfFriend(uid: string, fid: string) {
    return post(friend_url(uid), {fid, type: 1})
}

export function deleteFriend(uid: string, fid: string) {
    return del(friend_url(uid), {fid})
}


export function getFriendList(uid: string) {
    return get(friend_url(uid))
}

export function updateFriendVisibility(friend: Friend) {
    return put(friend_visibility_url, {}, friend)
}

export function getRelation(uid: string, fid: string) {
    return get(relation_url, {uid, fid})
}


export function getPostVisibility(uid: string, fid: string) {
    return get(post_visibility_url, {uid: uid, fid: fid})
}


export function getVisibleFriendIdList(uid: string) {
    return get(visible_friend_url(uid))
}


export function retrieveMessageAfterOffset(uid: string, topic: string, offset: number) {
    return get(message_url, {uid, topic, offset, dir: 'after'})
}


export function retrieveMessageBeforeOffset(uid: string, topic: string, offset: number) {
    return get(conditional_message_url, {uid, topic, offset, dir: 'before'})
}


export function retrieveNewestMessage(uid: string, topic: string) {
    return get(conditional_message_url, {uid, topic, dir: 'newest', offset: 0})
}


export function searchHistoryByKeyword(uid: string, topic: string, keyword: string) {

}


export function getFriendInfo(uid: string) {
    return get(friend_info_url(uid))
}


export function updateUser(user: User) {
    return put(user_url, {}, user)
}