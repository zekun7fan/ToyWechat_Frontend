import React, {useState} from 'react';
import {PostContent} from "../../net/interfaces";
import {Button, Comment, Popover} from "antd";
import {ComplexPost} from "../ComplexPost";


interface SimplePostContentProp {
    postContent: PostContent,
    uname: string
}


export function SimplePostContent(prop: SimplePostContentProp) {

    const action = [
        <Popover content={<ComplexPost content={prop.postContent} expand={true}/>} title="Post Detail" trigger="click">
            <Button>view detail</Button>
        </Popover>
    ]

    return (
        <div style={{minWidth: '300px'}}>
            <Comment
                actions={action}
                author={prop.uname}
                content={prop.postContent.content}
                datetime={prop.postContent.createTime}
            />
        </div>

    )

}