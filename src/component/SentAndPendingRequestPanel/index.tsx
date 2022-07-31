import React, {useEffect, useState} from 'react';
import {Message, Request, Resp} from "../../net/interfaces";
import {getSentAndFinishedRequests, getSentAndPendingRequests} from "../../net";
import {getUserId} from "../../utils/user";
import {Button, Card, List} from "antd";
import {UserAvatarPanel} from "../UserAvatarPanel";
import PubSub from "pubsub-js";
import VirtualList from 'rc-virtual-list';


export function SentAndPendingRequestPanel() {

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
        const raw = await getSentAndPendingRequests(getUserId()!)
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
                            <SentAndPendingReq item={item}/>
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </div>
    )
}


interface SentAndPendingReqProp {
    item: Request
}


function SentAndPendingReq(props: SentAndPendingReqProp) {

    return (
        <Card
            title={'request detail'}
            style={{width: 300}}
        >
            <UserAvatarPanel uid={props.item.handleUserId!}/>
            <p>you requested to add him/her as friend</p>
            <p>created time: {props.item.createTime!.toString()}</p>
        </Card>
    )

}