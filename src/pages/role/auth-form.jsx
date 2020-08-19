import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Tree,
    Input
} from 'antd'
import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree;
/*
    添加分类的form组件
*/
export default class AuthForm extends Component {

    //接受选中的角色
    static propTypes = {
        role: PropTypes.object
    }

    constructor (props) {
        super(props)
        //根据传入角色的menus生成初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    //为父组件提供获取最新menus数据
    getMenus = () => this.state.checkedKeys

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        }, [])
    }

    //选中某个Node时的回调
    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
      };
    

    UNSAFE_componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    //根据新传入的role来更新checkedKeys状态
    /* 
    当组件接收到新的属性时自动调用,在render之前去执行
    */
    UNSAFE_componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        //不会进入render()的流程
        this.setState({
            checkedKeys:menus
        })
        //this.state.checkedKeys = menus
    }

    render() {
        const { role } = this.props
        const { checkedKeys } = this.state
        const formItemLayout = {
            labelCol: { span: 4 }, //左侧Label的宽度
            wrapperCol: { span: 12 }, //指定右侧包裹的宽度
        };
        return (
            <Form>
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled />
                </Item>

                <Tree 
                checkable
                defaultExpandAll={true}
                checkedKeys={checkedKeys}
                onCheck={this.onCheck}
                >
                    <TreeNode title={<span style={{ color: '#34B085' }}>平台权限</span>} key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </Form>
        )
    }
}

