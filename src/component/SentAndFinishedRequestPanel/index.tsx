import React, {useEffect, useState} from 'react';
import {Button, List} from "antd";
import {getSentAndFinishedRequests} from "../../net";
import {getUserId} from "../../utils/user";
import {Message, Request, Resp} from "../../net/interfaces";
import {Card} from 'antd';
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import {UserAvatarPanel} from "../UserAvatarPanel";
import PubSub from "pubsub-js";
import VirtualList from 'rc-virtual-list';


export function SentAndFinishedRequestPanel() {

    const [requestList, setRequestList] = useState<Array<Request>>([])

    useEffect(() => {
        refresh().catch()
        const token = PubSub.subscribe(getUserId()!, (_: any, msg: Message) => {
            refresh().catch()
        })
        return () => {
            PubSub.unsubscribe(token)
        };
    }, [])


    const refresh = async () => {
        const raw = await getSentAndFinishedRequests(getUserId()!)
        const resp: Resp = raw.data
        if (resp.code === 0) {
            const list: Array<Request> = resp.data as Array<Request>
            setRequestList([...list])
        }
    };

    return (
        <div style={{paddingLeft: '80px', paddingTop: '40px', paddingRight: '80px'}}>
            <Button onClick={refresh}>
                refresh
            </Button>
            <List>
                <VirtualList
                    data={requestList}
                    height={600}
                    itemHeight={40}
                    itemKey="id"
                >
                    {(item: Request) => (
                        <List.Item key={item.id}>
                            <SentAndFinishedReq item={item}/>
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </div>
    )

}


interface SentAndFinishedReqProp {
    item: Request
}

function SentAndFinishedReq(props: SentAndFinishedReqProp) {

    return (
        <Card
            title={'request detail'}
            style={{width: 300}}
        >
            <UserAvatarPanel uid={props.item.handleUserId!}/>
            <p>{props.item.status === 1 ? 'rejected' : 'approved'} your request</p>
            <p>created time: {props.item.createTime!.toString()}</p>
        </Card>
    )
}