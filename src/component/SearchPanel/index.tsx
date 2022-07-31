import {useState} from "react";
import {Friend, Message, Resp, User} from "../../net/interfaces";
import { List, Avatar } from 'antd'
import { Input, Space } from 'antd';
import { Divider } from 'antd';


const { Search } = Input;

interface SearchPanelProp {
    friend: Friend,
    changeMode: Function
}


export function SearchPanel(prop: SearchPanelProp) {


    const [searchResult, setSearchResult] = useState<Array<Message>>([])


    const onSearch = (val: string) => {
        //

    };

    return (
        <div style={{paddingLeft: '80px', paddingTop: '40px', paddingRight: '80px'}}>
            <Search style={{maxWidth: '600px'}} placeholder="input search text" onSearch={onSearch} enterButton />
            <Divider />
            <List
                itemLayout="horizontal"
                dataSource={searchResult}
                renderItem={item => (
                    <p onClick={() => {
                        prop.changeMode(item.offset)
                    }}>{item.msg}</p>
                )}
            />
        </div>

    )





}
