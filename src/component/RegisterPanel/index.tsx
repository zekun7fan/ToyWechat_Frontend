import {Button, Col, Form, FormInstance, Input, message, Row, Select, Space} from 'antd';
import React, {useRef, useState} from 'react';
import {useNavigate} from "react-router";
import {DTO, Resp, User} from "../../net/interfaces";
import {toRegister} from "../../net";

const {Option} = Select




export interface RegisterUserInfo{
    id?: number,
    userId?: string,
    name?: string,
    bio?: string,
    sex?: number,
    email?: string,
    password?: string,
    password2?: string,
    avatarUrl?: string,
    backgroundUrl?: string,
    createTime?: Date
}

export function RegisterPanel() {



    const navigate = useNavigate();
    const ref = useRef<FormInstance>(null)

    const onFinish = async (userinfo: RegisterUserInfo) => {
        const pwd : string = userinfo.password!
        const pwd2 : string = userinfo.password2!
        if (pwd !== pwd2){
            message.warn("two password must be same");
            return
        }
        const user : User = {
            ...userinfo,
            createTime: new Date(),
            bio: 'I am new here'
        }
        const raw = await toRegister(user)
        const resp: Resp = raw.data as Resp
        message.info(resp.message)
        ref.current!.resetFields()
        if (resp.code === 0){
            navigate('/login')
        }
    };

    return (
            <div id="login_div">
                <Row justify="center" align="middle" style={{minHeight: '30vh'}}>
                    <Col span={24}>
                        <h1 style={{textAlign: 'center'}}>Register for a new account</h1>
                    </Col>
                    <Form
                        ref={ref}
                        name="user"
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 15 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, type: 'email' ,message: 'Please input your email!' }]}
                        >
                            <Input allowClear/>
                        </Form.Item>

                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input user name!' }]}
                        >
                            <Input allowClear/>
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password allowClear/>
                        </Form.Item>

                        <Form.Item
                            label="Confirm Password"
                            name="password2"
                            rules={[{ required: true, message: 'Please confirm your password!' }]}
                        >
                            <Input.Password allowClear/>
                        </Form.Item>

                        <Form.Item
                            label="Sex"
                            name="sex"
                            rules={[{ required: true, message: 'Please select user type!' }]}
                        >
                            <Select>
                                <Option value={"0"}>
                                    MALE
                                </Option>
                                <Option value={"1"}>
                                    FEMALE
                                </Option>
                            </Select>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                            <Space size={20}>
                                <Button type="primary" htmlType="submit">
                                    REGISTER
                                </Button>
                                <h4
                                    onClick={() => {navigate('/login');}}
                                >To Login ?</h4>
                            </Space>
                        </Form.Item>
                    </Form>
                </Row>
            </div>
    )
    
}