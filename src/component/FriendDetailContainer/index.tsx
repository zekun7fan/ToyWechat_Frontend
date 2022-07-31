import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Friend, Resp, User} from "../../net/interfaces";
import {getRelation, getUserById} from "../../net";
import {getUserId} from "../../utils/user";
import {UserDetailPanel} from "../UserDetailPanel";


export default function FriendDetailContainer() {


    const navigate = useNavigate()
    const {uid} = useParams()

    const [userInfo, setUserInfo] = useState<User>({})
    const [friend, setFriend] = useState<Friend | undefined>()


    // useEffect(() => {
    //     // getUser(uid!).catch()
    //     // getRelationship(uid!).catch()
    // },[])

    useEffect(() => {
        getUser(uid!).catch()
        getRelationship(uid!).catch()

    }, [uid])


    const getUser = async (uid: string) => {
        const raw = await getUserById(uid)
        const resp: Resp = raw.data
        if (resp.code === 0){
            setUserInfo(resp.data as User)
        }
    };

    const getRelationship = async (uid: string) => {
        const raw = await getRelation(getUserId()!, uid)
        const resp: Resp = raw.data
        if (resp.code === 0){
            setFriend(resp.data as Friend)
        }
    };

    return (
        <div>
            <UserDetailPanel user={userInfo} relation={friend}/>
        </div>

    )

}