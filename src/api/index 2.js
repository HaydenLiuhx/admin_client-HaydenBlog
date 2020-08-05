/* 
包含应用中所有接口请求模块,每个函数的返回值是Promise
*/
import ajax from './ajax'

//login 
/* export function reqLogin(username,password) {
    return ajax('/login', {username,password}, 'POST')
} */
export const reqLogin = (username,password) => ajax('/login', {username,password}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')