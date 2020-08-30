import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
//import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'
//import storageUtils from '../../utils/storageUtils'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'
/*
Role路由
*/
class Role extends Component {

    state = {
        roles: [], //所有角色列表
        role: {}, //选中的role
        isShowAdd: false, //是否显示添加界面
        isShowAuth: false, //是否显示设置权限界面
    }

    constructor (props) {
        super(props)

        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles: roles
            })
        }
    }

    onRow = (role) => {
        return {
            onClick: event => { //点击行
                console.log('row onClick', role)
                this.setState({
                    role: role
                })
            },
        }
    }
    //添加角色
    addRole = () => {
        //进行表单验证
        this.form.validateFields( async(error, values) => {
            if (!error) {
                //隐藏确认框
                this.setState({
                    isShowAdd: false
                })
                //收集数据->发请求->有结果->相应,处理,更新
                const {roleName} = values
                this.form.resetFields()//清空输入框
                const result = await reqAddRole(roleName)
                if (result.status===0) {
                    message.success('添加角色成功')
                    //this.getRoles() //换一种方法
                    //新产生的角色
                    const role = result.data
                    //更新roles状态
                    /* const roles = this.state.roles //1. 不太好
                    roles.push(role)
                    //删除
                    //roles.splice()
                    this.setState({
                        roles:roles
                    }) */

                    //const roles = [...this.state.roles] //2. 先产生一份,之后用setState更新

                    //3, 更新roles状态,基于原本状态数据更新/修改
                    this.setState((state, props) => ({
                        roles: [...this.state.roles, role]
                    }))
                    
                } else {
                    message.error('添加角色失败')
                }   
            }
        })
    }

    //更新角色
    updateRole = async () => {

        //隐藏确认框
        this.setState({
            isShowAuth: false
        })

        const role = this.state.role 
        //得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        //role.auth_name = memoryUtils.user.username
        role.auth_name = this.props.user.username
        //请求更新
        const result = await reqUpdateRole(role)
        if (result.status===0) {
            
            //this.getRoles() //更新列表
            //如果当前更新的事自己的权限,则重新登录
            //if (role._id===memoryUtils.user.role_id) {
            if (role._id===this.props.user.role_id) {
                // memoryUtils.user = {}
                // storageUtils.removeUser()
                // this.props.history.replace('/login')
                this.props.logout()
                message.success("当前用户角色权限修改成功,请重新登录")
            } else {
                message.success("设置角色权限成功")
                this.setState({
                    roles: [...this.state.roles]
                })
            }
            
        }
    }

    handleCancelAdd = () => {
        this.setState({
            isShowAdd: false
        })
        this.form.resetFields()//清空输入框
    }

    handleCancelAuth = () => {
        this.setState({
            isShowAuth: false
        })
    }

    UNSAFE_componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state
        const title = (
            <span>
                <Button 
                type="primary" 
                onClick={() => this.setState({isShowAdd:true})}
                >创建角色</Button>
                <Button 
                type="primary" 
                disabled={!role._id} 
                style={{ marginLeft: 15 }}
                onClick={() => this.setState({isShowAuth:true})}
                >设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    //loading={loading}
                    rowSelection={{ 
                        type: 'radio', 
                        selectedRowKeys: [role._id],
                        onSelect: (role) => { //radio
                            this.setState({
                                role: role
                            })
                        }
                    }}
                    onRow={this.onRow}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true
                    }}
                />

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={this.handleCancelAdd}
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={this.handleCancelAuth}
                >
                    <AuthForm role={role} ref={this.auth}/>
                </Modal>
            </Card>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {logout}
)(Role)