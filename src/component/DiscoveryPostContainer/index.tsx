import {PostListBackgroundPanel} from "../PostListBackgroundPanel";
import {getUserId} from "../../utils/user";
import React, {useEffect, useState} from "react";
import {DiscoveryResult, Friend, PostContent, Resp} from "../../net/interfaces";
import {
    addPostContent,
    discoveryNewPostList,
    discoveryOldPostList,
    getFriendList,
    getVisibleFriendIdList
} from "../../net";
import {Button, Collapse, List, message, Space} from "antd";
import {ComplexPost} from "../ComplexPost";
import InfiniteScroll from "react-infinite-scroll-component";
import { Input } from 'antd';
import VirtualList from 'rc-virtual-list';
import {UpCircleTwoTone} from "@ant-design/icons";


const { Panel } = Collapse;
const { TextArea } = Input;



export function DiscoveryPostContainer() {


    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [maxPidMap, setMaxPidMap] = useState<Map<string, number>>(new Map())
    const [minPidMap, setMinPidMap] = useState<Map<string, number>>(new Map())
    const [postContentList, setPostContentList] = useState<Array<PostContent>>([])
    const [content, setContent] = useState<string>("")


    useEffect(() => {
        setUp().catch()
    }, [])


    const setUp = async () => {
        const raw = await getVisibleFriendIdList(getUserId()!)
        const resp: Resp = raw.data
        if (resp.code === 0){
            const idList : Array<string> = resp.data as Array<string>
            let minMap = new Map<string, number>()
            let maxMap = new Map<string, number>()
            idList.forEach((id) => {
                minMap.set(id, 1000000)
                maxMap.set(id, 0)
            })
            const obj = Object.fromEntries(minMap)
            const raw2 = await discoveryOldPostList(getUserId()!, obj)
            const resp2: Resp = raw2.data as Resp
            if (resp2.code === 0){
                const result: DiscoveryResult = resp2.data as DiscoveryResult
                setPostContentList([...result.list])
                result.list.forEach((p) => {
                    minMap.set(p.userId, p.id!)
                })
                result.list.slice().reverse().forEach((p) => {
                    maxMap.set(p.userId, p.id!)
                })
                if (result.list.length < 10) {
                    setHasMore(false);
                }
                setMinPidMap(minMap)
                setMaxPidMap(maxMap)
            }
        }
    };


    const fetchNewPostList = async () => {
        if (loading){
            return
        }
        setLoading(true)
        const obj = Object.fromEntries(maxPidMap)
        const raw = await discoveryNewPostList(getUserId()!, obj)
        const resp: Resp = raw.data as Resp
        if (resp.code === 0){
            const result: DiscoveryResult = resp.data as DiscoveryResult
            setPostContentList([...result.list, ...postContentList])
            let maxMap = maxPidMap;
            result.list.slice().reverse().forEach((p) => {
                maxMap.set(p.userId, p.id!);
            })
            setMaxPidMap(maxMap);
            if (result.list.length == 0) {
                message.info("no new post fetched");
            }
        }
        setLoading(false)
    };


    const fetchOldPostList = async () => {
        if (!hasMore) {
            return;
        }
        if (loading){
            return
        }
        setLoading(true)
        const obj = Object.fromEntries(minPidMap)
        const raw = await discoveryOldPostList(getUserId()!, obj)
        const resp: Resp = raw.data as Resp
        if (resp.code === 0){
            const result: DiscoveryResult = resp.data as DiscoveryResult
            if (result.list.length == 0){
                setHasMore(false)
                return
            }
            let minMap = minPidMap;
            setPostContentList([...postContentList, ...result.list])
            result.list.forEach((p) => {
                minMap.set(p.userId, p.id!)
            })
            setMinPidMap(minMap);
            if (result.list.length < 10) {
                setHasMore(false);
            }
        }
        setLoading(false)
    };


    const onType = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setContent(e.target.value)
    };

    const onPost = async () => {
        const uid = getUserId()!
        const c: PostContent = {userId: uid, content: content}
        const raw = await addPostContent(uid, c);
        const resp: Resp = raw.data
        if (resp.code == 0) {
            message.info(resp.message)
            fetchNewPostList().catch()
            setContent("")
        }
    };


    return (
        <div style={{paddingLeft: '80px', paddingTop: '40px', paddingRight: '80px'}}>
            <Space>
                <Button icon={<UpCircleTwoTone/>} onClick={fetchNewPostList} />
                <Collapse>
                    <Panel header="Post something ?" key="1" style={{minWidth: '800px'}}>
                        <TextArea showCount maxLength={100} onChange={onType} value={content}/>
                        <Button onClick={onPost}>post</Button>
                    </Panel>
                </Collapse>
            </Space>
            <List>
                <VirtualList
                    data={postContentList}
                    height={600}
                    itemHeight={40}
                    itemKey="id"
                    onScroll={fetchOldPostList}
                >
                    {(item: PostContent) => (
                        <List.Item key={item.id}>
                            <ComplexPost content={item}/>
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </div>
    )
}













