
import React, {useEffect, useState} from 'react';
import { Popover, Button } from 'antd';
import {getRelation, getUserById} from "../../net";
import {Friend, Resp, User} from "../../net/interfaces";
import {UserDetailPanel} from "../UserDetailPanel";
import {getUserId} from "../../utils/user";

interface UserNamePanelProps{
    uid: string
}


export function UserNamePanel(prop: UserNamePanelProps) {

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
        if (resp.code === 0 && resp.data !== null){
            setRelationship(resp.data as Friend)
        }
    };


    return (
        <div>
            <Popover content={<UserDetailPanel user={user} relation={relationship}/>} title={'User Detail'} trigger="click">
                <p>{user.name}</p>
            </Popover>
        </div>

    )

}