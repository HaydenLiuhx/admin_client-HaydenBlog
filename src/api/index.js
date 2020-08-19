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
const BASE = '/api'

export const reqLogin = (username,password) => ajax(BASE + '/login', {username,password}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

//获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})
//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')
//更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', {categoryName, categoryId}, 'POST')
//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list' , {pageNum, pageSize}) 
/* 
搜索商品分类列表 --根据产品名字或者根据产品描述
searchType: 搜索的类型 {productName, productDesc}
 */
export const reqSearchProducts = (pageNum, pageSize, searchName, searchType) => ajax(BASE + '/manage/product/search', { 
    pageNum, 
    pageSize, 
    [searchType]: searchName,
})
//获取分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})
//更新商品的状态(上架和下架)
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')
//删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')
//添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id?'update': 'add'), product, 'POST')
//修改商品
//export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update', product, 'POST')
//获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add' , {roleName}, 'POST')
//更新角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update' , role, 'POST')

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
