import React, {useEffect, useState} from 'react';
import {getNewPostContent, getOldPostContent, getPostVisibility, getUserById} from "../../net";
import {PostContent, Resp, User} from "../../net/interfaces";
import {getUserId} from "../../utils/user";
import {SimplePostContent} from "../SimplePostContent";
import {Button, Empty, List, message, Space} from "antd";
import {useParams} from "react-router-dom";
import VirtualList from 'rc-virtual-list';




export function SingleUserPostContainer() {

    const {fid} = useParams()

    const [user, setUser] = useState<User>({})
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [visible, setVisible] = useState<boolean>(false)
    const [maxPid, setMaxPid] = useState<number>(0)
    const [minPid, setMinPid] = useState<number>(1000000)
    const [postContentList, setPostContentList] = useState<Array<PostContent>>([])


    useEffect(() => {
        setUp().catch()
    }, [fid])


    const setUp = async () => {
        const raw = await getPostVisibility(getUserId()!, fid!)
        const resp: Resp = raw.data
        const visible = resp.data as boolean
        if (resp.code === 0) {
            setVisible(visible)
            getUser(fid!).catch()
        }
        if (visible) {
            fetchInitialPostList().catch()
        }
    };


    const getUser = async (uid: string) => {
        const raw = await getUserById(uid)
        const resp: Resp = raw.data
        if (resp.code === 0) {
            setUser(resp.data as User)
        }
    };

    const fetchInitialPostList = async () => {
        const raw = await getOldPostContent(fid!, minPid)
        const resp: Resp = raw.data
        if (resp.code === 0) {
            const list: Array<PostContent> = resp.data as Array<PostContent>
            if (list.length > 0) {
                setMaxPid(list[0].id!)
                setMinPid(list[list.length - 1].id!)
                setPostContentList(list)
            }
            if (list.length < 10) {
                setHasMore(false);
            }
        }
    };

    const fetchNewList = async () => {
        if (loading) {
            return
        }
        setLoading(true)
        const raw = await getNewPostContent(fid!, maxPid)
        const resp: Resp = raw.data
        if (resp.code === 0) {
            const list: Array<PostContent> = resp.data as Array<PostContent>
            if (list.length > 0) {
                const newPostContentList = [...list, ...postContentList];
                setMaxPid(list[0].id!)
                setPostContentList(newPostContentList)
            }
            if (list.length == 0) {
                message.info("no new post fetched")
            }
        }
        setLoading(false)
    };



    const fetchOldList = async () => {
        if (!hasMore || loading) {
            return
        }
        setLoading(true)
        const raw = await getOldPostContent(fid!, maxPid)
        const resp: Resp = raw.data
        if (resp.code === 0) {
            const list: Array<PostContent> = resp.data as Array<PostContent>
            if (list.length > 0) {
                const newPostContentList = [...postContentList, ...list];
                setMinPid(list[list.length - 1].id!)
                setPostContentList(newPostContentList)
            }
            if (list.length < 10) {
                setHasMore(false);
            }
        }
        setLoading(false);

    };


    return (
        <div style={{paddingLeft: '80px', paddingTop: '40px', paddingRight: '80px'}}>
            <Space size={40}>
                <Button onClick={fetchNewList}>refresh</Button>
                <h1 style={{textAlign: 'center'}}>{user.name}'s posts</h1>
            </Space>
            {visible ?
                <List>
                    <VirtualList
                        data={postContentList}
                        height={600}
                        itemHeight={40}
                        itemKey="id"
                        onScroll={fetchOldList}
                    >
                        {(item: PostContent) => (
                            <List.Item key={item.id}>
                                <SimplePostContent key={item.postContentId} postContent={item} uname={user.name!}/>
                            </List.Item>
                        )}
                    </VirtualList>
                </List>
                : <Empty description={<h3>you have no access to these content</h3>}/>}
        </div>
    )
}