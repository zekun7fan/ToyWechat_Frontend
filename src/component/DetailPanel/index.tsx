import React, {useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {List} from "antd";
import {ComplexPost} from "../ComplexPost";
import {Friend, Message, Resp, User} from "../../net/interfaces";
import {retrieveMessageAfterOffset, retrieveMessageBeforeOffset} from "../../net";
import {MessageLine} from "../MessageLine";


interface DetailPanelProp {
    uid: string,
    topic: string,
    offset: number
}


export function DetailPanel(prop: DetailPanelProp) {

    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [maxOffset, setMaxOffset] = useState<number>(prop.offset)
    const [minOffset, setMinOffset] = useState<number>(prop.offset)
    const [messageList, setMessageList] = useState<Array<Message>>([])





    const getInitialMessage = async () => {
        const raw1 = await retrieveMessageBeforeOffset(prop.uid, prop.topic, prop.offset)
        const resp1: Resp = raw1.data as Resp
        if (resp1.code === 0){
            const list : Array<Message> = resp1.data as Array<Message>
            if (list.length > 0){
                setMessageList([...list, ...messageList])
                setMinOffset(list[0].offset!)
            }
        }
        const raw2 = await retrieveMessageAfterOffset(prop.uid, prop.topic, prop.offset-1)
        const resp2 : Resp = raw2.data as Resp
        if (resp2.code === 0){
            const list : Array<Message> = resp2.data as Array<Message>
            if (list.length > 0){
                setMessageList([...messageList, ...list])
                setMaxOffset(list[list.length-1].offset!)
            }
        }
    };

    const fetchOldMessage = async () => {
        if (loading){
            return
        }
        setLoading(true)
        const raw = await retrieveMessageBeforeOffset(prop.uid, prop.topic, minOffset)
        const resp: Resp = raw.data as Resp
        if (resp.code === 0){
            const list : Array<Message> = resp.data as Array<Message>
            if (list.length > 0){
                setMessageList([...list, ...messageList])
                setMinOffset(list[0].offset!)
            }
        }
        setLoading(false)
    };




    const fetchNewMessage = async () => {
        if (loading){
            return
        }
        setLoading(true)
        const raw = await retrieveMessageAfterOffset(prop.uid, prop.topic, maxOffset)
        const resp: Resp = raw.data as Resp
        if (resp.code === 0){
            const list : Array<Message> = resp.data as Array<Message>
            if (list.length > 0){
                setMessageList([...messageList, ...list])
                setMinOffset(list[list.length-1].offset!)
            }
        }
        setLoading(false)
    };








    return (
            <div
                id="scrollableDiv"
                style={{
                    height: 300,
                    overflow: 'auto',
                    padding: '0 16px',
                    display: 'flex',
                }}
            >
                <InfiniteScroll
                    dataLength={messageList.length}
                    hasMore={hasMore}
                    loader={<h3>loading</h3>}
                    endMessage={<h3>ending</h3>}
                    scrollThreshold={0.8}
                    next={fetchNewMessage}
                    pullDownToRefresh={true}
                    pullDownToRefreshThreshold={20}
                    refreshFunction={fetchOldMessage}
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={messageList}
                        renderItem={item => (
                            // <ComplexPost content={item}/>
                            <MessageLine message={item}/>
                        )}
                    />
                </InfiniteScroll>
            </div>

    )
}



