import React, {useEffect, useState} from "react";
import {Resp, User} from "../../net/interfaces";
import {getFriendInfo} from "../../net";
import {getPictureUrl, getUserId} from "../../utils/user";
import {Card, Layout} from "antd";
import { List, Avatar } from 'antd';
import {Route, Routes, useNavigate} from "react-router-dom";
import FriendDetailContainer from "../FriendDetailContainer";
import {UserOutlined} from "@ant-design/icons";
import VirtualList from 'rc-virtual-list';
import Meta from "antd/es/card/Meta";




const {  Sider, Content } = Layout;

export default function FriendListContainer() {

    const [friendList, setFriendList] = useState<Array<User>>([])

    const navigate = useNavigate()

    // componentDidMount
    useEffect( () => {
        getFriendList().catch()
    }, [])


    const getFriendList = async () => {
        const raw = await getFriendInfo(getUserId()!)
        const resp: Resp = raw.data as Resp
        if (resp.code === 0){
            const list: Array<User> = resp.data as Array<User>
            setFriendList(list)
        }
    };


    const avatarUI = (user : User) => {
        if (user.avatarUrl == "") {
            return (<Avatar size={64} icon={<UserOutlined/>}/>)
        }
        return (<Avatar size={64} src={getPictureUrl(user.avatarUrl!)}/>)
    };


    return (
        <Layout>
            <Sider style={{backgroundColor: 'aliceblue'}}>
                <List>
                    <VirtualList
                        data={friendList}
                        height={600}
                        itemHeight={20}
                        itemKey="userId"
                    >
                        {(item: User) => (
                            <List.Item key={item.userId}>
                                <Card
                                    style={{ width: 300 }}
                                    onClick={() => {
                                        navigate(`detail/${item.userId}`);
                                    }}
                                >
                                    <Meta
                                        avatar={avatarUI(item)}
                                        title={item.name}
                                        description={item.bio}
                                    />
                                </Card>
                            </List.Item>
                        )}
                    </VirtualList>
                </List>
            </Sider>
            <Content>
                <Routes>
                    <Route path={`detail/:uid`} element={<FriendDetailContainer/>}/>
                </Routes>
            </Content>
        </Layout>

    )
}