import React, {useEffect, useState} from 'react';
import {Message, Resp} from "../../net/interfaces";
import PubSub from 'pubsub-js'
import {getUserId} from "../../utils/user";
import {Button, Comment, List, message, Space} from "antd";
import {getUserById, retrieveMessageBeforeOffset, retrieveNewestMessage} from "../../net";
import {SimplePostContent} from "../SimplePostContent";
import VirtualList from 'rc-virtual-list';
import {UserAvatarPanel} from "../UserAvatarPanel";


export function NotificationWindow() {

    const [messageList, setMessageList] = useState<Array<Message>>([])
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [incomingMsg, setIncomingMsg] = useState<Message>()

    const fetchOldNotification = async () => {
        if (!hasMore) {
            message.warn("no more old notification")
        }
        const raw = await retrieveMessageBeforeOffset(getUserId()!, getUserId()!, messageList[0].offset! - 1)
        const resp: Resp = raw.data
        if (resp.code === 0) {
            const list: Array<Message> = resp.data as Array<Message>
            setMessageList([...list, ...messageList])
        }
    };

    useEffect(() => {
        setup().catch()
        const token = PubSub.subscribe(getUserId()!, (_: any, m: Message) => {
            // setMessageList([...messageList, message])
            setIncomingMsg(m)
        })
        return () => {
            PubSub.unsubscribe(token)
        };
    }, [])



    useEffect(() => {
        if (incomingMsg != null) {
            setMessageList([...messageList, incomingMsg])
        }
    }, [incomingMsg])


    const setup = async () => {
        const raw = await retrieveNewestMessage(getUserId()!, getUserId()!)
        const resp: Resp = raw.data
        if (resp.code == 0) {
            const data: Array<Message> = resp.data as Array<Message>
            setMessageList(data);
            if (data.length < 10) {
                setHasMore(false)
            }
        }
    };


    return (
        <div style={{paddingLeft: '80px', paddingTop: '40px', paddingRight: '80px'}}>
            {hasMore && <Button onClick={fetchOldNotification}>
                load more
            </Button>}
            <List>
                <VirtualList
                    data={messageList}
                    height={600}
                    itemHeight={20}
                    itemKey={(item) => {
                        return item.topic.concat(',').concat(String(item.offset!))
                    }}
                >
                    {(item: Message) => (
                        <List.Item key={item.topic.concat(',').concat(String(item.offset!))}>
                            <Comment
                                author={<p>Toywechat</p>}
                                content={
                                    <Space>
                                        <UserAvatarPanel uid={item.uid!}/>
                                        <p>{item.msg}</p>
                                    </Space>
                                }
                                datetime={item.create_time}
                            />
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </div>
    )

}