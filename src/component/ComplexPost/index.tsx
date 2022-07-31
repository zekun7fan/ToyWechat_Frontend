import React, {CSSProperties, useState} from 'react';
import {PostContent} from "../../net/interfaces";
import {ComplexPostContent} from "../ComplexPostContent";
import {PostLike} from "../PostLike";
import {PostCommentList} from "../PostComment";
import {Space} from "antd";




interface ComplexPostProp {
    content: PostContent
    expand?: boolean
}

export function ComplexPost(prop: ComplexPostProp) {

    const style: CSSProperties = prop.expand ? {minWidth: '400px', minHeight: '600px'} : {};

    return (
        <div style={style}>
            <Space direction="vertical" >
                <ComplexPostContent postContent={prop.content}/>
                <PostLike pid={prop.content.postContentId!}/>
                <PostCommentList pid={prop.content.postContentId!} uid={prop.content.userId}/>
            </Space>
        </div>
    )
}



