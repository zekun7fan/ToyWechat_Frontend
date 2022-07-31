import React, {useEffect, useState} from 'react';
import {Avatar, Popover} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {Friend, Resp, User} from "../../net/interfaces";
import {getRelation, getUserById} from "../../net";
import {getPictureUrl, getUserId} from "../../utils/user";
import {UserDetailPanel} from "../UserDetailPanel";



interface UserAvatarPanelProp {
    uid: string
}


export function UserAvatarPanel(prop: UserAvatarPanelProp) {

    const [user, setUser] = useState<User>({})
    const [relationship, setRelationship] = useState<Friend | undefined>()

    useEffect( () => {
        getUser(prop.uid).catch()
        getRelationship(prop.uid).catch()
    }, [])


    const getUser = async (uid: string) => {
        const raw = await getUserById(prop.uid)
        const resp: Resp = raw.data
        if (resp.code === 0){
            setUser(resp.data as User)
        }
    };

    const getRelationship = async (uid: string) => {
        const raw = await getRelation(getUserId()!, uid)
        const resp: Resp = raw.data
        if (resp.code === 0){
            setRelationship(resp.data as Friend)
        }
    };


    const avatarUI = () => {
        if (user.avatarUrl == null || user.avatarUrl == "") {
            return (<Avatar size={64} icon={<UserOutlined/>}/>)
        }
        return (<Avatar size={64} src={getPictureUrl(user.avatarUrl!)}/>)
    };


    return (
        <div>
            <Popover content={<UserDetailPanel user={user} relation={relationship}/>} title="User Detail" trigger="click">
                {avatarUI()}
            </Popover>
        </div>
    )

}