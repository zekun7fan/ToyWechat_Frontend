import React, {useEffect, useState} from 'react';
import {Message, Request, Resp} from "../../net/interfaces";
import {
    addFullFriend,
    addHalfFriend,
    getHandledAndPendingRequests,
    handleRequest
} from "../../net";
import {getUserId} from "../../utils/user";
import {Button, Card, List, message} from "antd";
import {UserAvatarPanel} from "../UserAvatarPanel";
import {
    CheckCircleTwoTone,
    CloseCircleTwoTone,
} from "@ant-design/icons";
import PubSub from "pubsub-js";
import VirtualList from 'rc-virtual-list';


export function HandleAndPendingRequestPanel() {


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
        const raw = await getHandledAndPendingRequests(getUserId()!)
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
                            <HandleAndPendingReq item={item}/>
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </div>
    )

}


interface HandleAndPendingReqProps {
    item: Request
}


function HandleAndPendingReq(props: HandleAndPendingReqProps) {


    const [handled, setHandled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);


    const approveRequest = async (req: Request) => {
        if (loading) {
            return
        }
        if (handled) {
            message.warn("you have already handled this request!")
            return
        }
        setLoading(true)
        const request: Request = {
            ...req,
            status: 2
        }
        const raw = await handleRequest(request)
        const resp: Resp = raw.data as Resp
        message.info(resp.message)
        if (resp.code === 0) {
            setHandled(true);
        }
        setLoading(false)
    };


    const rejectRequest = async (req: Request) => {
        if (loading) {
            return
        }
        if (handled) {
            message.warn("you have already handled this request!")
            return
        }
        setLoading(true)
        const request: Request = {
            ...req,
            status: 1
        }
        const raw = await handleRequest(request)
        const resp: Resp = raw.data as Resp
        message.info(resp.message)
        if (resp.code == 0) {
            setHandled(true);
        }
        setLoading(false);
    };


    return (
        <Card
            title={'request detail'}
            style={{width: 300}}
            actions={[
                <Button
                    icon={<CheckCircleTwoTone/>}
                    key={'approve'}
                    loading={loading}
                    onClick={() => {
                        approveRequest(props.item).catch()
                    }}
                >
                    Approve
                </Button>,
                <Button
                    icon={<CloseCircleTwoTone/>}
                    key={'reject'}
                    loading={loading}
                    onClick={() => {
                        rejectRequest(props.item).catch()
                    }}
                >
                    Reject
                </Button>,
                // <CheckCircleTwoTone key={'approve'} onClick={() => {
                //     approveRequest(props.item).catch()
                // }}/>,
                // <CloseCircleTwoTone key={'reject'} onClick={() => {
                //     rejectRequest(props.item).catch()
                // }}/>,
            ]}
        >
            <UserAvatarPanel uid={props.item.requestUserId!}/>
            <p>request to add you as friend</p>
            <p>created time: {props.item.createTime!.toString()}</p>
        </Card>
    )

}
