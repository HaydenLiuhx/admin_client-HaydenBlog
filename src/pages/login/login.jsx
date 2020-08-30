//import React, { Component } from 'react'
import React from 'react';
// eslint-disable-next-line
import {Redirect} from 'react-router-dom'
//import ReactDOM from 'react-dom';
import { Input, Button, Checkbox } from 'antd';
import { Form, Icon } from '@ant-design/compatible';
//import { message } from 'antd'
import './login.less'
import logo from '../../assets/images/logo.png'
//import { reqLogin } from '../../api'
//import memoryUtils from '../../utils/memoryUtils'
//import storageUtils from '../../utils/storageUtils'
import '@ant-design/compatible/assets/index.css';
import { connect } from 'react-redux'
import { login } from '../../redux/actions'
//const Item = Form.Item; //不能写在import前

//登录的路由组件

class NormalLoginForm extends React.Component {
    handleSubmit = e => {
        //阻止事件的默认行为
        e.preventDefault();
        //对所有表单字段进行校验
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // 校验成功
                const { username, password } = values
                //调用分发异步action的函数 =》 发登录的异步请求
                this.props.login(username, password) 

                /*
                 const result = await reqLogin(username, password)
                //console.log("Request successful", response.data)
                //{status:0, data: user} //{status:1, msg:xx}
                
                if (result.status === 0){
                    //显示登录成功
                    message.success("Login successfully")
                    const user = result.data
                    memoryUtils.user = user //保存在内存中
                    storageUtils.saveUser(user) //保存到localstorage
                    //跳转到后台管理界面
                    //push(),replace()
                    this.props.history.replace('/home') //不需要再回退回来
                }
                else { //登录失败,提示错误信息
                    message.error(result.msg)
                } 
                */
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
        //如果用户已经登录,自动跳转到管理界面,先关闭!!
        //const user = memoryUtils.user
        const user = this.props.user
        if(user && user._id) {
            //return <Redirect to='/admin'/>
            return <Redirect to='/home'/>
        }

        //const errorMsg = this.props.user.errorMsg
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>Backend Admin Control System -- Hayden</h1>
                </header>
                <section className="login-content">
                    {/* <div>{errorMsg}</div> */}
                    <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
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
                                    //initialValue: 'Hayden?'
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
export default connect(
    state => ({user: state.user}),
    {login}
)(WrapLogin)
//ReactDOM.render(<WrappedNormalLoginForm />, mountNode);




/* 1.前台表单认证

用户名/密码的的合法性要求

1). 必须输入

2). 必须大于等于 4 位

3). 必须小于等于 12 位

4). 必须是英文、数字或下划线组成 */

/*
async和await
1.作用?
    简化promise对象的使用,消灭了.then()来指定成功或者失败回掉函数
    以同步编码(无回调函数)方式实现异步流程
2.哪里写await和async
    在返回promise的表达式左侧写await, 不想要promise,想要promise异步执行成功的value数据
    await所在函数(最近的)定义的左侧

reqLogin(username, password).then(response => { //由axios文档决定
                    console.log('successful', response.data)
                }).catch(error => {
                    console.log('failed', error)
                }) // ^ + -
*/