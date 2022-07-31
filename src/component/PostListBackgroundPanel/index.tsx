import React, {useEffect, useState} from 'react';
import { Image } from 'antd';
import { Divider } from 'antd';
import {Resp, User} from "../../net/interfaces";
import {getUserById} from "../../net";


interface PostListBackgroundPanelProp {
    uid: string

}

export function PostListBackgroundPanel(prop: PostListBackgroundPanelProp) {


    const [user, setUser] = useState<User>({})

    // componentDidMount
    useEffect( () => {
        getUser(prop.uid).catch()
    }, [])



    const getUser = async (uid: string) => {
        const raw = await getUserById(prop.uid)
        const resp: Resp = raw.data
        if (resp.code === 0){
            setUser(resp.data as User)
        }
    };


    return (
        <div>
            <Image
                width={200}
                src={user.backgroundUrl}
            />
            <Divider />
        </div>
    )


}