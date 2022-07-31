import React, {useState} from 'react';
import {LoginedUserInfo, Resp, User} from "../../net/interfaces";
import {toLogin} from "../../net";
import {user_id_key, user_token_key} from "../../utils/user";
import {Button, Col, Form, Image, Input, message, Row, Space} from "antd";
import {useNavigate} from "react-router";

export function LoginPanel() {

    let navigate = useNavigate();

    const onFinish = async (user: User) => {
        const raw = await toLogin(user)
        const resp: Resp = raw.data as Resp
        const info: LoginedUserInfo = resp.data as LoginedUserInfo
        message.info(resp.message)
        if (resp.code == 0) {
            sessionStorage.setItem(user_id_key, info.uid)
            sessionStorage.setItem(user_token_key, info.token)
            navigate("/home")
        }
    }

    return (


        <Space>
            <Image
                width={800}
                height={800}
                preview={false}
                src={'https://www.brandignity.com/wp-content/uploads/2012/11/social-networking.jpg'}
            />
            <div id="login_div">
                <Row justify="center" align="middle" style={{minHeight: '30vh'}}>
                    <Col span={24}>
                        <h1 style={{textAlign: 'center'}}>Welcome to ToyWechat</h1>
                    </Col>

                    <Form
                        name="user"
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                        autoComplete="off"
                        id="login_form"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{required: true, type: 'email', message: 'Please input your email!'}]}
                        >
                            <Input allowClear/>
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{required: true, message: 'Please input your password!'}]}
                        >
                            <Input.Password allowClear/>
                        </Form.Item>

                        <Form.Item wrapperCol={{offset: 0, span: 24}}>
                            <Space size={20}>
                                <Button type="primary" htmlType="submit">
                                    LOGIN
                                </Button>
                                <h4 onClick={() => {navigate('/register')}}>not register yet?</h4>
                            </Space>
                        </Form.Item>
                    </Form>
                </Row>
            </div>
        </Space>


    )

}