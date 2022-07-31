import React, {useEffect, useState} from 'react';
import {Friend, Message, Request, Resp, User} from "../../net/interfaces";
import {
    getUserById,
    retrieveMessage,
    retrieveMessageBeforeOffset,
    retrieveNewestMessage,
    sendMessage,
    sendRequest
} from "../../net";

import {Button, Layout, List, message, Modal, Space} from 'antd';
import {Input} from 'antd';
import {getUserId} from "../../utils/user";
import {MessageLine} from "../MessageLine";
import {useLocation, useParams} from "react-router-dom";
import VirtualList from 'rc-virtual-list';
import {UpCircleTwoTone} from "@ant-design/icons";


const {Header, Footer, Content} = Layout;
const {TextArea} = Input;


export function CurrentChatWindow() {

    const location = useLocation()
    const data: { friend: Friend } = location.state as { friend: Friend }

    const [user, setUser] = useState<User>({})
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [msg, setMsg] = useState<string>('')
    const [messageList, setMessageList] = useState<Array<Message>>([])
    const [incomingMessage, setIncomingMessage] = useState<Message | undefined>()
    const [visible, setVisible] = useState<boolean>(false);


    useEffect(() => {
        reset()
        if (data.friend.valid) {
            getUser(data.friend.friendId!).catch()
            getInitialMessage().catch()
            const token = PubSub.subscribe(data.friend.topicId!, (_, m: Message) => {
                setIncomingMessage(m);
            })
            return () => {
                console.log("unsubscribe token")
                PubSub.unsubscribe(token);
            };
        }
    }, [location.state])

    const reset = () => {
        setHasMore(true);
        setMsg('');
        setIncomingMessage(undefined);
        setLoading(false);
        setVisible(false);
        setUser({})
        setMessageList([])
    };


    useEffect(() => {
        if (incomingMessage != null) {
            setMessageList([...messageList, incomingMessage]);
        }
    }, [incomingMessage])


    const getUser = async (uid: string) => {
        const raw = await getUserById(data.friend.friendId!)
        const resp: Resp = raw.data
        if (resp.code === 0) {
            setUser(resp.data as User)
        }
    };


    const getInitialMessage = async () => {
        const raw = await retrieveNewestMessage(getUserId()!, data.friend.topicId!)
        const resp: Resp = raw.data as Resp
        if (resp.code === 0) {
            const list: Array<Message> = resp.data as Array<Message>
            setMessageList([...list])
            if (list.length < 10) {
                setHasMore(false);
            }
        }
    };


    const fetchOldMessage = async () => {
        if (!hasMore) {
            message.info("no more early message");
            return;
        }
        if (loading) {
            return
        }
        setLoading(true)
        const raw = await retrieveMessageBeforeOffset(getUserId()!, data.friend.topicId!, messageList[0].offset! - 1)
        const resp: Resp = raw.data as Resp
        if (resp.code === 0) {
            const list: Array<Message> = resp.data as Array<Message>
            setMessageList([...list, ...messageList])
            if (list.length == 0) {
                setHasMore(false)
            }
        }
        setLoading(false)
    };

    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMsg(e.target.value)
    };

    const onSendMessage = async () => {
        if (!data.friend.valid) {
            setVisible(true);
            return;
        }
        const m: Message = {
            uid: getUserId()!,
            topic: data.friend.topicId!,
            msg: msg
        }
        const raw = await sendMessage(m)
        const resp: Resp = raw.data as Resp
        if (resp.code !== 0) {
            message.error(resp.message)
        } else {
            setMsg('')
        }
    };

    const handleOk = async () => {
        const req: Request = {
            requestUserId: getUserId()!,
            handleUserId: data.friend.friendId!,
            status: 0,
            createTime: new Date()
        }
        const raw = await sendRequest(req);
        const resp: Resp = raw.data
        message.info(resp.message);
    };

    const handleCancel = () => {
        setVisible(false);
    };


    return (
        <Layout>
            <Header style={{backgroundColor: "aliceblue", textAlign: 'center'}}>
                <Space size={20}>
                    <Button icon={<UpCircleTwoTone/>} onClick={fetchOldMessage}/>
                    <h1>{user.name}</h1>
                </Space>
            </Header>
            <Content>
                {hasMore && data.friend.valid && <Button onClick={fetchOldMessage}>loading more</Button>}
                <List>
                    <VirtualList
                        data={messageList}
                        height={400}
                        itemHeight={20}
                        itemKey={(item) => {
                            return item.topic.concat(',').concat(String(item.offset!))
                        }}
                    >
                        {(item: Message) => (
                            <List.Item key={item.offset}>
                                <MessageLine message={item}/>
                            </List.Item>
                        )}

                    </VirtualList>
                </List>
            </Content>
            <Footer>
                <TextArea
                    showCount
                    maxLength={200}
                    onChange={onInputChange}
                    value={msg}
                    onPressEnter={onSendMessage}
                />
                <Button onClick={onSendMessage}>
                    Send
                </Button>
                <Modal title="Add Friend" visible={visible} onOk={handleOk} onCancel={handleCancel}>
                    <h3>please add him/her as your friend before sending message</h3>
                </Modal>
            </Footer>
        </Layout>
    )
}

