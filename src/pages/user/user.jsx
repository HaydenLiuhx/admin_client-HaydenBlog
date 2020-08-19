import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { reqUsers, reqDeleteUser } from '../../api'

let rolesNameArr = []
/*
User路由
*/
export default class User extends Component {

    state = {
        users: [], //所有用户的列表
        roles: [], //所有角色的列表
        isShow: false,
    }

    initColumns = () => {
        this.columns = [
            {
                title: "用户名",
                dataIndex: 'username'
            },
            {
                title: "邮箱",
                dataIndex: 'email'
            },
            {
                title: "电话",
                dataIndex: 'phone'
            },
            {
                title: "注册时间",
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: "所属角色",
                dataIndex: 'role_id',
                //render: (role_id) => this.state.roles.find(role => role._id===role_id).name
                //render: (role_id) => this.state.roles.find(role => true).name
                render: (role_id) => this.rolesNames[role_id]
            },
            {
                title: "操作",
                render: (user) => (
                    <span>
                        <LinkButton>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    //根据role的数组,生成包含所有角色名字的对象(属性名用角色id)
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        //保存起来
        this.rolesNames = roleNames
        console.log(this.rolesNames)
        for (let key in roleNames) {
            //console.log(roleNames[key])
            rolesNameArr.push(roleNames[key])
        }
    }

    //删除指定用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            content: '此操作不可撤销!',
            onOk: async() => {
                const result = await reqDeleteUser(user._id)
                if (result.status===0) {
                    message.success('删除用户成功!')
                    this.getUsers()
                }
            },
            onCancel() { 
                console.log('Cancel')
            },
        })
    }

    //添加或者更新用户
    addOrUpdateUser = () => {

    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                users, roles
            })
        }
    }

    handleCancel = () => {
        this.setState({ isShow: false })
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const { users, isShow } = this.state
        const title = <Button 
        type="primary"
        onClick={() => this.setState({isShow:true})}
        >创建用户</Button>
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    //loading={loading}
                    pagination={{
                        defaultPageSize: 5,
                        showQuickJumper: true
                    }}
                />

                <Modal
                    title="添加用户"
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={this.handleCancel}
                >
                    <div>添加/更新界面</div>
                </Modal>

            </Card>
        )
    }
}