import React, {CSSProperties, useState} from 'react';
import {Message} from "../../net/interfaces";
import {Comment, Space} from "antd";
import {UserAvatarPanel} from "../UserAvatarPanel";
import {getUserId} from "../../utils/user";


interface MessageLineProp {
    message: Message

}


export function MessageLine(prop: MessageLineProp) {


    if (prop.message.uid == getUserId()!) {
        return (
            <Space>
                <div style={{minWidth: '760px'}}/>
                <Comment
                    content={<p>{prop.message.msg}</p>}
                    datetime={prop.message.create_time}
                />
                <UserAvatarPanel uid={prop.message.uid}/>
            </Space>
        )
    }

    return (
        <Space>
            <UserAvatarPanel uid={prop.message.uid}/>
            <Comment
                content={<p>{prop.message.msg}</p>}
                datetime={prop.message.create_time}
            />
        </Space>
    )

}