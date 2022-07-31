import React, {createRef, Ref, useEffect, useState} from 'react';
import {PostComment, Resp} from "../../net/interfaces";
import {Button, List, message, Space} from "antd";
import {UserNamePanel} from "../UserNamePanel";
import {addComment, getComment} from "../../net";
import {Input} from 'antd';
import {TextAreaRef} from "antd/es/input/TextArea";
import {getUserId} from "../../utils/user";

const {TextArea} = Input;


interface PostCommentProp {
    pid: string,
    uid: string

}


export function PostCommentList(prop: PostCommentProp) {

    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [text, setText] = useState<string>();
    const [maxCommentId, setMaxCommentId] = useState<number>(0)
    const [visible, setVisible] = useState<boolean>(false)
    const [user2Id, setUser2Id] = useState<string>('')
    const [commentList, setCommentList] = useState<Array<PostComment>>([])


    useEffect(() => {
        onLoadNewCommment().catch()
    }, [])

    const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
    };

    const sendComment = async () => {
        if (text == null || text == "") {
            message.warn("can not send empty message");
            return;
        }
        const comment: PostComment = {
            postContentId: prop.pid,
            userId: getUserId()!,
            user2Id: user2Id,
            comment: text,
            createTime: new Date()
        }
        const raw = await addComment(prop.pid, comment)
        const resp: Resp = raw.data as Resp
        message.info(resp.message)
        if (resp.code === 0) {
            onLoadNewCommment().catch()
            setText('');
        }
    };


    const hideInputArea = () => {
        setVisible(false)
        setText('')
    };


    const onLoadNewCommment = async () => {
        setLoading(true)
        const raw = await getComment(prop.pid, maxCommentId)
        const resp: Resp = raw.data
        if (resp.code === 0) {
            const fetchList: Array<PostComment> = resp.data as Array<PostComment>
            if (fetchList.length > 0) {
                setMaxCommentId(fetchList[fetchList.length - 1].id!)
                setCommentList([...commentList, ...fetchList])
            }
            if (fetchList.length < 10) {
                setHasMore(false);
            }
        }
    };


    const loadMore =
        !loading && hasMore ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={onLoadNewCommment}>loading more</Button>
            </div>
        ) : null;

    return (
        <div>
            <Button onClick={() => {
                setUser2Id(prop.uid)
                setVisible(true)
            }}>
                reply
            </Button>
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                locale={{emptyText: () => {
                    return null;
                }}}
                loadMore={loadMore}
                dataSource={commentList}
                renderItem={item => (
                    <div key={item.postCommentId}>
                        <Space>
                            <UserNamePanel uid={item.userId!}/><p>replies to</p><UserNamePanel uid={item.user2Id!}/><p
                            onClick={() => {
                                setUser2Id(item.userId!)
                                setVisible(true)
                            }}>: {item.comment}</p>
                        </Space>
                    </div>

                )}
            />
            {visible ?
                (
                    <div>
                        <TextArea showCount maxLength={100} style={{height: 120}} onChange={onTextChange} value={text}/>
                        <Button onClick={sendComment}>
                            send comment
                        </Button>
                        <Button onClick={hideInputArea}>
                            hide
                        </Button>
                    </div>
                )
                : null
            }

        </div>
    )
}