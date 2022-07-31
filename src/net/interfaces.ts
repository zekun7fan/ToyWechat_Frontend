


export interface DTO {

}



export interface ReqQueryParams {

}



export interface Resp {
    code: number,
    message: string,
    data?: DTO

}



export interface User extends DTO{
    id?: number,
    userId?: string,
    name?: string,
    bio?: string,
    sex?: number,
    email?: string,
    password?: string,
    avatarUrl?: string,
    backgroundUrl?: string,
    createTime?: Date
}


export interface Message extends DTO{
    uid: string,
    topic: string,
    msg: string,
    offset?: number,
    create_time?: Date
}


export interface UserPicInfo {
    url : string
}



export interface DiscoveryResult {
    friendToPostSeq: Map<string, number>
    list: Array<PostContent>

}


export interface PostComment extends DTO{
    id?: number,
    postCommentId?: string,
    postContentId?: string,
    userId?: string,
    user2Id?: string,
    comment?: string,
    createTime?: Date
}





export interface PostContent extends DTO{
    id?: number,
    postContentId?: string,
    userId: string,
    content: string,
    createTime?: Date
}

export interface Request extends DTO{
    id?: number,
    requestUserId?: string,
    handleUserId?: string,
    status?: number,
    createTime?: Date
}


export interface Friend extends DTO{
    id?: number,
    userId?: string,
    friendId?: string,
    topicId?: string,
    hideMyself?: boolean,
    blockOpposite?: boolean,
    inChatting?: boolean,
    valid?: boolean
}


export interface LoginedUserInfo {
    uid: string,
    name: string,
    token: string
}





