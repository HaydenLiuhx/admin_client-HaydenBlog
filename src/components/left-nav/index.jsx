import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd';
import { Icon } from '@ant-design/compatible';
// import {
//   PieChartOutlined,
//   DesktopOutlined,
//   ContainerOutlined,
//   MailOutlined,
// } from '@ant-design/icons';

import menuList from '../../config/menuConfig'
import './index.less'

import logo from '../../assets/images/logo.png'

const { SubMenu } = Menu;
/*
左侧导航组件
*/
export default class LeftNav extends Component {

  /* 
   根据menu的数据数组生成对应的标签数组
   使用map加递归调用
  */
  getMenuNodes = (menuList) => {
    return menuList.map(item => {
      if (!item.children) {
        return (
        <Menu.Item key={item.key}>
          <Link to={item.key}>
            <Icon type={item.icon}/>
            <span>{item.title}</span>
          </Link>
        </Menu.Item>
        )}
        else {
          return (
            <SubMenu
              key={item.key}
              title={
              <span>
              <Icon type={item.icon} />
              <span>{item.title}</span>
              </span>
              }
            >
              {this.getMenuNodes(item.children)}
              </SubMenu>
          )
        }
    })
  }

  render() {
    return (

      <div className="left-nav">
        <Link to='/' className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>Hayden's Blog</h1>
        </Link>

        <div style={{ width: 200 }}>
          <Menu
            mode="inline"
            theme="dark"
          >
            {
              this.getMenuNodes(menuList)
            }
            {/* <Menu.Item key="/home" icon={<PieChartOutlined />}>
            <Link to='/home'>
              <span>Home</span>
            </Link>
          </Menu.Item> */}
            {/* <SubMenu key="sub1" icon={<MailOutlined />} title="Product">
            <Menu.Item key="/category" icon={<MailOutlined />}>
              <Link to='/category'>
                <span>Class Admin</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/product" icon={<MailOutlined />}>
              <Link to='/product'>
                <span>Product Admin</span>
              </Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="/user" icon={<DesktopOutlined />}>
          <Link to='/user'>
              <span>User</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/role" icon={<ContainerOutlined />}>
          <Link to='/role'>
              <span>Role</span>
            </Link>
          </Menu.Item>

          <SubMenu key="sub2" icon={<MailOutlined />} title="Charts">
            <Menu.Item key="/charts/bar" icon={<MailOutlined />}>
              <Link to='/charts/bar'>
                <span>Bar</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/charts/line" icon={<MailOutlined />}>
              <Link to='/charts/line'>
                <span>Line</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/charts/pie" icon={<MailOutlined />}>
              <Link to='/charts/pie'>
                <span>Pie</span>
              </Link>
            </Menu.Item>
          </SubMenu> */}

          </Menu>
        </div>
      </div>

    )
  }
}