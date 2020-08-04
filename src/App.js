/*
应用根组件

该类是继承react提供的component，export default App;
是为了将App公开，index.js才能够引用。App.js继承了component的话，必须使用render进行渲染。
return的内容是类似于html结构的内容，就是jsx，jsx语法是react的主要语法。
*/
import React from 'react';
import { Component } from "react";
//import { message, Button, Space } from 'antd';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component {

    render() {
        //嵌套的标签,'/'减少一层
        return (
            <BrowserRouter>
            {/* 只匹配其中一个 */}
            <Switch>   
            <Route path='/login' component={Login}></Route>
            <Route path='/' component={Admin}></Route>
            </Switch>
            </BrowserRouter>

        )
    }
}
