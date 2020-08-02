import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import logo from './images/logo.png'

//const Item = Form.Item; //不能写在import前

//登录的路由组件

export default class Login extends Component {

    handleSubmit = (event) => {

    }

    render() {
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>Backend Admin Control System -- Hayden</h1>
                </header>
                <section className="login-content">
                    <h2>User Sign in</h2>
                    <div>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: true }}
                            onSubmit={this.handleSubmit}
                        >
                            <Form.Item>
                                <Input prefix={<UserOutlined className="site-form-item-icon" />}  type="user" placeholder="Username" className="login-form-input" />
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                    className="login-form-input"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
        </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}