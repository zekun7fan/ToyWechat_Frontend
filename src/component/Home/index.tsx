import React, {useState} from 'react';
import {Empty, Layout, Menu, Space} from 'antd';
import {NavLink, Route, Routes} from "react-router-dom";
import {SettingEditPanel} from "../SettingEditPanel";
import RequestListContainer from "../RequestListContainer";
import {DiscoveryPostContainer} from "../DiscoveryPostContainer";
import FriendListContainer from "../FriendListContainer";
import {SimpleChatWindowContainer} from "../SimpleChatWindowContainer";
import {SingleUserPostContainer} from "../SingleUserPostContainer";
import {NotificationWindow} from "../NotificationWindow";
import {UserSearchPanel} from "../UserSearchPanel";
import {Readme} from "../Readme";

const {Header, Footer, Sider, Content} = Layout;


export function Home() {

    return (
        <div>
            <Layout style={{minHeight: '100vh'}}>
                <Sider style={{backgroundColor: 'antiquewhite'}}>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <NavLink to={`chat`}>
                            <h3>chatting</h3>
                        </NavLink>
                        <NavLink to={`friends`}>
                            <h3>friend</h3>
                        </NavLink>
                        <NavLink to={`search`}>
                            <h3>search</h3>
                        </NavLink>
                        <NavLink to={`request`}>
                            <h3>request</h3>
                        </NavLink>
                        <NavLink to={`discovery`}>
                            <h3>discovery</h3>
                        </NavLink>
                        <NavLink to={`notification`}>
                            <h3>notification</h3>
                        </NavLink>
                        <NavLink to={`setting`}>
                            <h3>setting</h3>
                        </NavLink>
                        <NavLink to={`readme`}>
                            <h3>readme</h3>
                        </NavLink>
                    </Space>
                </Sider>
                <Content>
                    <Routes>
                        <Route path={'chat/*'} element={<SimpleChatWindowContainer/>}/>
                        <Route path={'friends/*'} element={<FriendListContainer/>}/>
                        <Route path={'search'} element={<UserSearchPanel/>}/>
                        <Route path={'request'} element={<RequestListContainer/>}/>
                        <Route path={'discovery'} element={<DiscoveryPostContainer/>}/>
                        <Route path={'notification'} element={<NotificationWindow/>}/>
                        <Route path={'friend/:fid/post'} element={<SingleUserPostContainer/>}/>
                        <Route path={'setting'} element={<SettingEditPanel/>}/>
                        <Route path={'readme'} element={<Readme/>}/>
                        <Route path={''} element={<Empty description={<h1>ToyWechat</h1>}/>}/>
                    </Routes>
                </Content>
            </Layout>
        </div>
    )
}




