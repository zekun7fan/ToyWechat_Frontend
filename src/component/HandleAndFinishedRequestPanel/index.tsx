import React, {useEffect, useState} from 'react';
import {Message, Request, Resp} from "../../net/interfaces";
import {getHandledAndFinishedRequests, getSentAndFinishedRequests} from "../../net";
import {getUserId} from "../../utils/user";
import {Button, Card, List} from "antd";
import {UserAvatarPanel} from "../UserAvatarPanel";
import PubSub from "pubsub-js";
import VirtualList from 'rc-virtual-list';


export function HandleAndFinishedRequestPanel() {

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
        const raw = await getHandledAndFinishedRequests(getUserId()!)
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
                            <HandleAndFinishedReq item={item}/>
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </div>
    )
}


interface HandleAndFinishedReqProps {
    item: Request
}


function HandleAndFinishedReq(props: HandleAndFinishedReqProps) {

    return (
        <Card
            style={{width: 300}}
            title={'request detail'}
        >
            <UserAvatarPanel uid={props.item.requestUserId!}/>
            <p>request to add you as friend</p>
            <p>created time: {props.item.createTime!.toString()}</p>
            <p>result: you {props.item.status === 1 ? 'reject' : 'approved'} this request</p>
        </Card>
    )

}