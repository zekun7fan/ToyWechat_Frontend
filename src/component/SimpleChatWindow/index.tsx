import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {Button, message} from "antd";


import { Card, Avatar } from 'antd';
import {Friend, Message, Resp, User} from "../../net/interfaces";
import {getUserById} from "../../net";
import { Badge } from 'antd';
import {friend_url} from "../../net/url";
import PubSub from 'pubsub-js'
import {UserOutlined} from "@ant-design/icons";
import {getPictureUrl} from "../../utils/user";

const { Meta } = Card;


interface SimpleChatWindowProp {
    friend: Friend
}


export function SimpleChatWindow(prop: SimpleChatWindowProp) {

    const navigate = useNavigate()

    const [user, setUser] = useState<User>({})
    const [unreadNum, setUnreadNum] = useState<number>(0)
    const [latestMsg, setLatestMsg] = useState<string>('')
    const [incomingMsg, setIncomingMsg] = useState<Message>()

    // componentDidMount
    useEffect( () => {
        getUser(prop.friend.friendId!).catch()
        const token = PubSub.subscribe(prop.friend.topicId!, (_: any, m: Message) => {
            setIncomingMsg(m)
        })

        return () => {
            // PubSub.unsubscribe(prop.friend.topicId!)
            PubSub.unsubscribe(token)
        };
    }, [])


    useEffect(() => {
        console.log("unread=", unreadNum)
        if (incomingMsg != null) {
            setLatestMsg(incomingMsg.msg)
            if (incomingMsg.uid == user.userId) {
                setUnreadNum(unreadNum + 1)
            }
        }
    }, [incomingMsg])

    const getUser = async (uid: string) => {
        const raw = await getUserById(prop.friend.friendId!)
        const resp: Resp = raw.data
        if (resp.code === 0){
            setUser(resp.data as User)
        }
    };

    const showCurrentChatWindow = () => {
        setUnreadNum(0)
        navigate(`/home/chat/${prop.friend.friendId}`)
    };




    const avatarUI = () => {
        if (user.avatarUrl == null || user.avatarUrl == "") {
            return (<Avatar size={64} icon={<UserOutlined/>}/>)
        }
        return (<Avatar size={64} src={getPictureUrl(user.avatarUrl!)}/>)
    };

    return (
        <Badge count={unreadNum}>
            <Card
                style={{ width: 300 }}
                onClick={showCurrentChatWindow}
            >
                <Meta
                    avatar={avatarUI()}
                    title={user.name}
                    description={latestMsg}
                />
            </Card>
        </Badge>
    )
}

