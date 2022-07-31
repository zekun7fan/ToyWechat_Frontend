import React, {useEffect, useState} from 'react';
import {NavLink, Route, Routes} from "react-router-dom";
import {Button, Card, Layout, Tabs} from "antd";
import {List} from 'antd';
import {SimpleChatWindow} from "../SimpleChatWindow";
import {getFriendList, retrieveMessage} from "../../net";
import {getUserId} from "../../utils/user";
import {Friend, Message, Request, Resp} from "../../net/interfaces";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import {CurrentChatWindow} from "../CurrentChatWindow";
import PubSub from "pubsub-js";
import {START_MESSAGE_TOPIC} from "../../net/constants";
import VirtualList from 'rc-virtual-list';




export function SimpleChatWindowContainer() {

    const [chatWindowList, setChatWindowList] = useState<Array<Friend>>([])

    const [incomingFriend, setIncomingFriend] = useState<Friend>()

    let timer: NodeJS.Timeout;

    useEffect(() => {
        getFriends().catch()
        const token = PubSub.subscribe(START_MESSAGE_TOPIC, (_: any, friend: Friend) => {
            setIncomingFriend(friend)
        })
        const uid = getUserId()
        if (uid !== null) {
            timer = setInterval(() => {
                getMessages().catch()
            }, 2000)
        }
        return () => {
            if (uid !== null) {
                clearInterval(timer)
            }
            PubSub.unsubscribe(token)
        };
    }, [])


    const getMessages = async () => {
        const raw = await retrieveMessage(getUserId()!)
        const resp: Resp = raw.data as Resp
        if (resp.code === 0) {
            const list: Array<Message> = resp.data as Array<Message>
            list.forEach((msg) => {
                PubSub.publish(msg.topic, msg);
            })
        }
    };


    useEffect(() => {
        if (incomingFriend != null) {
            const list = chatWindowList.filter((f) => {
                return f.friendId != incomingFriend.friendId;
            })
            setChatWindowList([incomingFriend, ...list])
        }
    }, [incomingFriend])


    const getFriends = async () => {
        const raw = await getFriendList(getUserId()!)
        const resp: Resp = raw.data as Resp
        if (resp.code === 0) {
            const list: Array<Friend> = resp.data as Array<Friend>
            setChatWindowList([...list])
        }
    };


    return (
        <div>
            <Layout>
                <Sider style={{backgroundColor: "aliceblue"}}>
                    <List>
                        <VirtualList
                            data={chatWindowList}
                            height={600}
                            itemHeight={40}
                            itemKey="friendId"
                        >
                            {(item: Friend) => (
                                <List.Item key={item.friendId}>
                                    <NavLink key={item.friendId} to={`detail/${item.friendId}`} state={{friend: item}}>
                                        <SimpleChatWindow friend={item}/>
                                    </NavLink>
                                </List.Item>
                            )}
                        </VirtualList>
                    </List>
                </Sider>
                <Content>
                    <Routes>
                        <Route path={`detail/:fid`} element={<CurrentChatWindow/>}/>
                    </Routes>
                </Content>
            </Layout>

        </div>

    )

}
