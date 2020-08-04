import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu} from 'antd';
import {
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
  } from '@ant-design/icons';


import './index.less'

import logo from '../../assets/images/logo.png'

const { SubMenu } = Menu;
/*
左侧导航组件
*/
export default class LeftNav extends Component {
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
          <Menu.Item key="/home" icon={<PieChartOutlined />}>
            <Link to='/home'>
              <span>Home</span>
            </Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<MailOutlined />} title="Product">
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
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
          <Menu.Item key="3" icon={<ContainerOutlined />}>
            Option 3
          </Menu.Item>
          
        </Menu>
      </div>
            </div>

        )
    }
}