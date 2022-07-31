import React, {useEffect, useState} from 'react';
import {Avatar, Button, Divider, Empty, Input, message, Modal, Popconfirm, Space} from 'antd';
import {Resp, User, UserPicInfo} from "../../net/interfaces";
import {getUserById, toLogout, updateUser} from "../../net";
import {getPictureUrl, getUserId, user_id_key} from "../../utils/user";
import {ManOutlined, UploadOutlined, UserOutlined, WomanOutlined} from "@ant-design/icons";
import Upload from "antd/es/upload/Upload";
import {UploadChangeParam, UploadFile} from "antd/es/upload/interface";
import TextArea from "antd/es/input/TextArea";
import {useNavigate} from "react-router";
import {baseURL} from "../../net/http";


export function SettingEditPanel() {

    const [user, setUser] = useState<User>({})
    const [edit, setEdit] = useState<number>(0)
    const navigate = useNavigate();


    useEffect(() => {
        getUser().catch()
    }, [])

    const getUser = async () => {
        const uid: string = getUserId()!
        const raw = await getUserById(uid)
        const resp: Resp = raw.data
        if (resp.code == 0) {
            const u: User = resp.data as User
            setUser(u)
        }
        setEdit(0);
    };

    const onAvatarChange = async (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'done') {
            message.success(" avatar uploaded successfully");
            const resp : Resp = info.file.response as Resp
            if (resp.code == 0) {
                const res : UserPicInfo = resp.data as UserPicInfo
                const u : User = {...user, avatarUrl: res.url}
                setUser(u);
            }
            message.info(resp.message)
        }
    };


    const avatarUI = () => {
        if (user.avatarUrl == null || user.avatarUrl == "") {
            return (<Avatar size={64} icon={<UserOutlined/>}/>)
        }
        return (<Avatar size={64} src={getPictureUrl(user.avatarUrl!)}/>)
    };


    const logout = async () => {
        const raw = await toLogout(user)
        const resp : Resp = raw.data
        if (resp.code == 0) {
            sessionStorage.removeItem(user_id_key)
            message.info(resp.message)
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        }
    };


    return (
        <div style={{paddingLeft: '50px', paddingTop: '50px'}}>
            <Space >
                {avatarUI()}
                <Upload
                    name={'file'}
                    action={`${baseURL}/user_service/${getUserId()!}/avatar`}
                    onChange={onAvatarChange}
                    method={'PUT'}
                >
                    <Button icon={<UploadOutlined/>}>upload/change avatar</Button>
                </Upload>
            </Space>
            <Divider/>
            <p>uid: {user!.userId!}</p>
            <p>email: {user!.email!}</p>
            <Divider/>
            <p>name: {user!.name!}</p>
            <p>sex: {user!.sex === 0 ? <ManOutlined/> : <WomanOutlined/>}</p>
            <Divider/>
            <p>bio: {user!.bio!}</p>
            <p>join time: {user!.createTime!}</p>
            <Divider/>
            <Button onClick={() => {
                setEdit(edit + 1)
            }}>EDIT</Button>
            <Divider/>
            <Popconfirm
                title="Are you sure to logout?"
                onConfirm={logout}
                okText="Yes"
                cancelText="No"
            >
                <Button>Logout</Button>
            </Popconfirm>
            <EditModal edit={edit} user={user!} refresh={getUser}/>
        </div>


    )
}


interface EditModalProps {
    edit: number
    user: User
    refresh: Function
}


function EditModal(props: EditModalProps) {

    const [visible, setVisible] = useState<boolean>(false)
    const [user, setUser] = useState<User>({})

    useEffect(() => {
        setVisible(props.edit > 0)
        setUser(props.user)
    }, [props])


    const handleOk = async () => {
        const raw = await updateUser(user!)
        const resp: Resp = raw.data
        if (resp.code == 0) {
            setVisible(false);
            props.refresh()
            return
        }
        message.warn(resp.message)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name: string = e.target.value
        setUser({...user, name: name})

    };

    const onBioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const bio: string = e.target.value
        setUser({...user, bio: bio})
    };


    return (
        <Modal
            title="Edit User Info"
            visible={visible} onOk={handleOk}
            onCancel={handleCancel}
            okText={'Confirm Modification'}
        >
            uid: <Input disabled={true} defaultValue={user.userId}/>
            email: <Input disabled={true} defaultValue={user.email}/>
            <Divider/>
            name: <Input defaultValue={user.name} onChange={onNameChange} required={true}/>
            <p>sex: {user.sex === 0 ? <ManOutlined/> : <WomanOutlined/>}</p>
            <Divider/>
            bio: <TextArea showCount maxLength={200} defaultValue={user.bio} onChange={onBioChange} required={true}/>
            <p>join time: {user.createTime!}</p>
            <Divider/>
        </Modal>
    )
}


