import React, {useEffect, useState} from 'react';
import {addPostLike, delPostLike, getPostLike} from "../../net";
import {Resp, User} from "../../net/interfaces";
import {message} from "antd";
import { Popover, Button } from 'antd';
import { List } from 'antd';
import {getUserId} from "../../utils/user";
import {LikeOutlined, LikeTwoTone} from "@ant-design/icons";
import {UserNamePanel} from "../UserNamePanel";



interface PostLikeProp {
    pid: string
}

export function PostLike(prop: PostLikeProp) {

    const [liked, setLiked] = useState<boolean>()

    const [userIdList, setUserIdList] = useState<Array<string>>([])



    useEffect( () => {
        getLikedList().catch()
    }, [])


    const getLikedList = async () => {
        const raw = await getPostLike(prop.pid)
        const resp : Resp = raw.data
        if (resp.code === 0){
            const list : Array<string> = resp.data as Array<string>
            setUserIdList(resp.data as Array<string>)
            const u1 = list.find((uid) => {
                return uid == getUserId()!
            })
            setLiked(u1 != null)
        }
    };

    const unlike = async () => {
        const raw = await delPostLike(prop.pid, getUserId()!)
        const resp : Resp = raw.data
        if (resp.code === 0){
            setLiked(false)
            const list = userIdList?.filter((uid) => {
                return uid !== getUserId()!
            })
            setUserIdList(list)
        }
    };


    const like = async () => {
        const raw = await addPostLike(prop.pid, getUserId()!)
        const resp : Resp = raw.data
        if (resp.code === 0){
            setLiked(true)
            const list = [...userIdList]
            list.push(getUserId()!)
            setUserIdList(list)
        }
    }

    const likedUserList = (
        <div>
            <List
                itemLayout="horizontal"
                dataSource={userIdList}
                renderItem={item => (
                    <UserNamePanel uid={item}/>
                )}
            />
        </div>
    )


    return (
        <div>
            {liked ? <LikeTwoTone onClick={unlike}/> :<LikeOutlined onClick={like}/>}
            <Popover
                content={likedUserList}
                title="User List"
                trigger="click"
            >
                <b>{userIdList?.length} people liked it</b>
            </Popover>
        </div>

    )
    
}

