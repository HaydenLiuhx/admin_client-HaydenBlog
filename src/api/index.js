/* 
包含应用中所有接口请求模块,每个函数的返回值是Promise
*/
import ajax from './ajax'
import jsonp from 'jsonp'

import {message} from 'antd'

//login 
/* export function reqLogin(username,password) {
    return ajax('/login', {username,password}, 'POST')
} */
const BASE = ''

export const reqLogin = (username,password) => ajax(BASE + '/api/login', {username,password}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax(BASE + '/api/manage/user/add', user, 'POST')

//jsonp请求
export const reqWeather = (city) => {

return new Promise((resolve,reject) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=daf9a333298a022bba0539a6fdcbc2ca`
    jsonp(url, {}, (err,data) => {
        console.log('jsonp()',err,data)
        //如果成功了
        if (!err && data.cod === 200) {
            const dayPictureUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            const weather = data.weather[0].main
            const temperature = parseInt(data.main.temp - 273.15)
            resolve({dayPictureUrl,weather, temperature})
            
        }
        else {
            //如果失败了
            message.error('获取天气信息失败了!')
        }
    })
})

    
}
//reqWeather('Sydney')
