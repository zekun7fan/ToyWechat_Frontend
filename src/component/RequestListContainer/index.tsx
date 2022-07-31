import React, {useRef, useState} from 'react';
import { Tabs, Radio, Space } from 'antd';
import {SentAndPendingRequestPanel} from "../SentAndPendingRequestPanel";
import {SentAndFinishedRequestPanel} from "../SentAndFinishedRequestPanel";
import {HandleAndFinishedRequestPanel} from "../HandleAndFinishedRequestPanel";
import {HandleAndPendingRequestPanel} from "../HandleAndPendingRequestPanel";
const { TabPane } = Tabs;


export default function RequestListContainer() {



    return (
        <Tabs tabPosition={'left'}>
            <TabPane tab="Pending Requests From Me" key="1">
                <SentAndPendingRequestPanel/>
            </TabPane>
            <TabPane tab="Finished Requests By Me" key="2">
                <HandleAndFinishedRequestPanel/>
            </TabPane>
            <TabPane tab="Pending Requests From Others" key="3">
                <HandleAndPendingRequestPanel/>
            </TabPane>
            <TabPane tab="Finished Requests By Others" key="4">
                <SentAndFinishedRequestPanel/>
            </TabPane>
        </Tabs>

    )
}