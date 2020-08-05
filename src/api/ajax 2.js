/* 
能发送异步ajax请求的模块
封装axios库
返回值是promise
*/

import axios from 'axios'
export default function ajax(url, data = {}, type = 'GET') {
    if (type === 'GET') { //发GET请求
        return axios.get(url, {
            params: data
        })
    }
    else { //POST
        return axios.post(url, data)
    }
}

//请求登录接口
//ajax('/login', {username: 'Tom', password: '12345'}, 'POST').then()
//添加用户