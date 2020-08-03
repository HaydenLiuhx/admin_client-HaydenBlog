//import React, { Component } from 'react'
import React from 'react';
//import ReactDOM from 'react-dom';
import { Input, Button, Checkbox } from 'antd';
import { Form, Icon } from '@ant-design/compatible';

import './login.less'
import logo from './images/logo.png'
import '@ant-design/compatible/assets/index.css';
//const Item = Form.Item; //不能写在import前

//登录的路由组件

class NormalLoginForm extends React.Component {
    handleSubmit = e => {
        //阻止事件的默认行为
        e.preventDefault();
        //对所有表单字段进行校验
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 校验成功

                //const {username, password} = values
                console.log('Received values of form: ', values);
            }
            else {
                console.log(err)
            }
        });
    };
    //对密码进行自定义验证
    valiodatorPWD = (rule, value, callback) => {
        // console.log(rule, value)

        const length = value && value.length

        const pwdReg = /^[a-zA-Z0-9_]+$/

        if (!value) {

            // callback 如果不传参代表校验成功，如果传参代表校验失败，并且会提示错误

            callback('必须输入密码')

        } else if (length < 4) {

            callback('密码必须大于 4 位')

        } else if (length > 12) {

            callback('密码必须小于 12 位')

        } else if (!pwdReg.test(value)) {

            callback('密码必须是英文、数组或下划线组成')

        } else {

            callback() // 必须调用 callback,不穿参数表明没问题

        }
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>Backend Admin Control System -- Hayden</h1>
                </header>
                <section className="login-content">
                    <h2>User Sign in</h2>
                    <div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {/*
                                用户名/密码的的合法性要求
                                1). 必须输入
                                2). 必须大于等于 4 位
                                3). 必须小于等于 12 位
                                4). 必须是英文、数字或下划线组成
                            */}
                                {getFieldDecorator('username', {
                                    //声明式验证:使用别人定义好的规则进行验证
                                    rules: [{ required: true, whitespace: true, message: 'Please input your username!' },
                                    { min: 4, message: 'username.length > 4!' },
                                    { max: 12, message: 'username.length < 12' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'username should be English,number or _' }],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Username"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            validator: this.valiodatorPWD
                                        }
                                    ],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="Password"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(<Checkbox>Remember me</Checkbox>)}
                                <a className="login-form-forgot" href="/#">
                                    Forgot password
          </a>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
          </Button>
          Or <a href="/#">register now!</a>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}

/* 
1.高阶函数
    1) 接受函数类型的参数
    2) 返回值是函数
    3) 常见的高阶函数:
        a.定时器- setTimeout() setInterval()
        b.Promise: Promise(() => then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/fliter()/map()/reduce()/find()
        d. fn.bind()
    4) 高阶函数更新动态,更加具有扩展性

2.高阶组件
    1)本身是一个函数
    2)接受一个组件(被包装组件),返回一个新的组件(包装组件),包装组件会向被包装组件传入特定的属性

包装Form组件,生成一个新的组件
新组建会传递一个
*/

//const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
const WrapLogin = Form.create()(NormalLoginForm)
export default WrapLogin
//ReactDOM.render(<WrappedNormalLoginForm />, mountNode);




/* 1.前台表单认证

用户名/密码的的合法性要求

1). 必须输入

2). 必须大于等于 4 位

3). 必须小于等于 12 位

4). 必须是英文、数字或下划线组成 */