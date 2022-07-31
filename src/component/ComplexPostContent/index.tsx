import {PostContent} from "../../net/interfaces";
import {UserAvatarPanel} from "../UserAvatarPanel";
import {UserNamePanel} from "../UserNamePanel";
import {Comment, Space} from "antd";
import React from "react";


interface ComplexPostContentProp {
    postContent: PostContent
}


export function ComplexPostContent(prop: ComplexPostContentProp) {


    return (
        <div>
            <Space>
                <UserAvatarPanel uid={prop.postContent.userId}/>
                <UserNamePanel uid={prop.postContent.userId}/>
            </Space>
            <Comment
                content={prop.postContent.content}
                datetime={prop.postContent.createTime}
            />
        </div>
    )

}