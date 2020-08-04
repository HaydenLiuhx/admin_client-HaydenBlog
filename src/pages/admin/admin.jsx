import React, { Component } from 'react'

import { Redirect } from 'react-router-dom'
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

const { Footer, Sider, Content } = Layout;
//admin的路由组件

export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        //如果内存中没有存储user ==> 当前没有登录
        if (!user || !user._id) {
            //自动跳转到登录(在render()中),不同时机不同跳转
            return <Redirect to='/login' />
        }
        return (
            <div style={{height:'100%'}}>
                <Layout style={{height: '100%'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content style={{backgroundColor:'#fff'}}>Content</Content>
                        <Footer style={{textAlign:'center',color:'#ccc'}}>Copyright 2020 - Hayden's Blog</Footer>
                    </Layout>
                </Layout>
            </div>
        )
    }
}