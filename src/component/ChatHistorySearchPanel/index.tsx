import {Friend, PostContent} from "../../net/interfaces";
import React, {useState} from "react";
import {Button, Divider} from "antd";
import {DetailPanel} from "../DetailPanel";
import {SearchPanel} from "../SearchPanel";
import {getUserId} from "../../utils/user";


interface ChatHistorySearchPanelProp {
    friend: Friend
    visible: boolean
}

export function ChatHistorySearchPanel(prop: ChatHistorySearchPanelProp) {


    const [showDetail, setShowDetail] = useState<boolean>(false)
    const [offset, setOffset] = useState<number>(0)


    const changeMode = (offs: number) => {
        setShowDetail(true)
        setOffset(offs)
    };

    return (
        <div>
            <Button onClick={() => {
                setShowDetail(false)
            }}>
                Cancel
            </Button>
            <p>Chat History Search</p>
            <Divider/>
            {showDetail ?
                <DetailPanel uid={prop.friend.userId!} topic={prop.friend.topicId!} offset={offset}/>
                :
                <SearchPanel friend={prop.friend} changeMode={changeMode}/>
            }
        </div>
    )

}

