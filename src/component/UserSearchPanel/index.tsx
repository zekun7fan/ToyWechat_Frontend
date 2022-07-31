import React, {useState} from 'react';
import {Button, Card, Empty, Input, Space} from 'antd';
import {Friend, Resp, User} from "../../net/interfaces";
import Search from "antd/es/input/Search";
import {getRelation, getUserByEmail} from "../../net";
import {getUserId} from "../../utils/user";
import {UserDetailPanel} from "../UserDetailPanel";
import {message} from "antd/es";


export function UserSearchPanel() {


    const [user, setUser] = useState<User | undefined>()
    const [relationship, setRelationship] = useState<Friend | undefined>()


    const onSearch = async (value: string) => {
        if (value == null || value == "") {
            return;
        }
        const raw = await getUserByEmail(value);
        const resp: Resp = raw.data
        if (resp.code != 0) {
            setUser(undefined);
            message.warn("no user with this email address found")
        }
        const u: User = resp.data as User
        const raw2 = await getRelation(getUserId()!, u.userId!)
        const resp2: Resp = raw2.data
        if (resp2.code === 0) {
            const rel: Friend = resp2.data as Friend
            setUser(u);
            setRelationship(rel)
        }
    };


    return (
        <div style={{paddingLeft: '80px', paddingTop: '40px', paddingRight: '80px'}}>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Search
                    placeholder="input user's email address"
                    allowClear
                    enterButton="Search"
                    size="large"
                    required={true}
                    type={"email"}
                    onSearch={onSearch}
                />
                {user != null ?
                    <UserDetailPanel user={user!} relation={relationship}/> :
                    <Empty/>
                }
            </Space>
        </div>
    );
}
