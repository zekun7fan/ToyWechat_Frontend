import {Friend, Request, Resp, User} from "../../net/interfaces";
import React, {useEffect, useState} from 'react';
import {Button, Divider, Popconfirm, Space} from 'antd';
import { Avatar } from 'antd';
import { message } from 'antd';
import { Switch } from 'antd';
import {ManOutlined, UserOutlined, WomanOutlined} from '@ant-design/icons';
import {deleteFriend, getUserById, sendRequest, updateFriendVisibility} from "../../net";
import {getPictureUrl, getUserId} from "../../utils/user";
import {START_MESSAGE_TOPIC} from "../../net/constants";
import {useNavigate} from "react-router-dom";


interface UserDetailPanelProp {
    user : User
    relation?: Friend
}

export function UserDetailPanel(prop: UserDetailPanelProp) {


    const navigate = useNavigate();

    const [user, setUser] = useState<User | undefined>()
    const [friend, setFriend] = useState<Friend | undefined>(prop.relation)


    useEffect(() => {
        setUser(prop.user)
        setFriend(prop.relation)
    }, [prop])

    const viewPosts = () => {
        navigate(`/home/friend/${user!.userId}/post`)
    };

    const addFriend = async () => {
        const req: Request = {
            requestUserId: getUserId()!,
            handleUserId: prop.user.userId,
            status: 0,
            createTime: new Date()
        }
        const raw = await sendRequest(req)
        const resp: Resp = raw.data
        message.info(resp.message)
    };

    // const startMessage = () => {
    //     navigate("home/chat");
    //     PubSub.publish(START_MESSAGE_TOPIC, friend);
    // };

    const delFriend = async () => {
        const raw = await deleteFriend(getUserId()!, prop.user.userId!)
        const resp: Resp = raw.data
        message.info(resp.message)
    }


    const onHideSelfChange = async (checked: boolean) => {
        const f: Friend = {...friend, hideMyself: checked}
        const raw = await updateFriendVisibility(f)
        const resp: Resp = raw.data
        if (resp.code === 0){
            message.info(resp.message);
            setFriend(f)
        }
    };

    const onBlockOppositeChange = async (checked: boolean) => {
        const f: Friend = {...friend, blockOpposite: checked}
        const raw = await updateFriendVisibility(f)
        const resp: Resp = raw.data
        if (resp.code === 0){
            message.info(resp.message);
            setFriend(f)
        }

    };


    const rel = () => {
        if (getUserId()! == prop.user.userId!) {
            return (
                <div>
                    <Space direction={"vertical"}>
                        <Button onClick={viewPosts}>
                            Posts
                        </Button>
                    </Space>
                </div>
            )
        }
        if (friend != null) {
            return (
                <div>
                    <Space direction={"vertical"}>
                        <Space>
                            <Button onClick={viewPosts}>
                                Posts
                            </Button>
                            <b>Hide Self</b><Switch defaultChecked onChange={onHideSelfChange} checked={friend!.hideMyself}/>
                            <b>Block Him/Her</b><Switch defaultChecked onChange={onBlockOppositeChange} checked={friend!.blockOpposite}/>
                            <Divider />
                        </Space>
                        <Space>
                            {/*<Button onClick={startMessage}>*/}
                            {/*    MESSAGE*/}
                            {/*</Button>*/}
                            <Popconfirm
                                title="Are you sure to delete this friend?"
                                onConfirm={delFriend}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger={true}>
                                    DELETE FRIEND
                                </Button>
                            </Popconfirm>
                        </Space>
                    </Space>
                </div>
            )
        }
        return (
            <div>
                <Space direction={"vertical"}>
                    <Button onClick={addFriend}>
                        ADD FRIEND
                    </Button>
                </Space>
            </div>
        )
    };


    const avatarUI = () => {
        if (prop.user.avatarUrl == undefined || prop.user.avatarUrl == "") {
            return (<Avatar size={64} icon={<UserOutlined/>}/>)
        }
        return (<Avatar size={64} src={getPictureUrl(prop.user.avatarUrl!)}/>)
    };


    return (
        <div style={{paddingLeft: '80px', paddingTop: '40px', paddingRight: '80px'}}>
            <Space size={10}>
                {avatarUI()}
                <h1>{prop.user.name}</h1>
                {prop.user.sex === 0 ? <ManOutlined size={200}/> : <WomanOutlined size={128}/>}
            </Space>
            <Divider />
            <h1>{prop.user.bio}</h1>
            <Divider />
            <h1>email: {prop.user.email}</h1>
            <h1>join time: {prop.user.createTime}</h1>
            <Divider />
            {
                rel()
            }
            <Divider />
        </div>
    )
}