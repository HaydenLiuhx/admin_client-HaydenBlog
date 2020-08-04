/* 
能发送异步ajax请求的模块
封装axios库
返回值是promise
1. 优化: 统一处理请求异常
    在外层包一个自己创建的promise对象
    在请求出错时,不去reject(error),而是显示错误提示
2.小优化:异步得到response.data
*/

import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {

    return new Promise((resolve, reject) => {
        let promise
        //1.异步ajax请求
        if (type === 'GET') { //发GET请求
            promise = axios.get(url, {
                params: data
            })
        }
        else { //POST
            promise = axios.post(url, data)
        }
        //2.如果成功了,调用resolve(value)
        promise.then(response => {
            resolve(response.data)
            //3.如果失败了,不调用reject(reason),通过提示异常信息
        }).catch(error => {
            message.error("Request error: " + error.message)
        })
    })


}

//请求登录接口
//ajax('/login', {username: 'Tom', password: '12345'}, 'POST').then()
//添加用户