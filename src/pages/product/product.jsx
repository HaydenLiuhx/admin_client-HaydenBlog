import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import './product.less'
import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
/*
Product路由,逐层匹配,精确匹配
*/
export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path='/product' component={ProductHome} exact/>
                <Route path='/product/addupdate' component={ProductAddUpdate} />
                <Route path='/product/detail' component ={ProductDetail} />
                <Redirect to ='/product'/>
            </Switch>
        )
    }
}